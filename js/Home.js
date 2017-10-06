import React from 'react';
import io from 'socket.io-client';
import {
  Paper, CircularProgress, Dialog, FlatButton, Drawer,
  TextField, FontIcon, Snackbar
} from 'material-ui';
import { green700, white, amber600, grey200, red400, red500, red600, blue200, blue400, blue500, deepOrange500, amber400,
          grey500, grey700, darkBlack, green500, yellow500, green400, green600, greenA700, grey400, cyanA400, cyanA700,
          green200, red200, amber200, orange200, orange400, green50, amberA400, amberA700} from 'material-ui/styles/colors';
import SearchBar from 'material-ui-search-bar';

import ReactList from 'react-list';


import CompanyCard from './CompanyCard';

const styles = {
  bar: {
    height: 75,
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: grey200
  }
}

var socket = io();

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      companies: [],
      userCompanies: {},
      searchQuery: '',
      dialogOpen: false,
      drawerOpen: false,
      usersOnline: 1
    };
    this.oc = {
      openDialog: ((jsx, actions) => {this.setState({dialogOpen: true, dialogJSX: jsx, dialogActions: actions})}),
      closeDialog: (() => {this.setState({dialogOpen: false})}),
      openDrawer: ((jsx) => {this.setState({drawerOpen: true, drawerJSX: jsx})})
    };
  }

  signInGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    //var provider = new firebase.auth.GithubAuthProvider();
    provider.setCustomParameters({
       'prompt': 'select_account'
    });
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // if(!user.email.includes('@harvard.college.edu')) {
      //   firebase.auth().signOut();
      // } else {
      //   this.setState({
      //     loggedIn: true
      //   })
      // }
    }.bind(this)).catch(function(error) {

      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      this.setState({
        loginError: true
      });
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      this.props.openClose.showSnack('Error with login.');
    });
  };

  filterCompanies = () => {
    var filteredList = [];
    for(var i=0; i<this.state.companies.length; i++) {
      var company = Object.assign({},this.state.companies[i], {oc: this.oc});
      if((!this.state.searchQuery || company.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())) 
          && (!this.state.ownFilter || (!this.state.userCompanies || (company.companyid in this.state.userCompanies && this.state.userCompanies[company.companyid].bookmarked)))
          && (this.state.sectorFilter !== 'tech' || company.sectorName == 'Information Technology')
          && (this.state.sectorFilter !== 'finance' || company.sectorName == 'Finance')
          && (this.state.sectorFilter !== 'consulting' || company.sectorName == 'Business Services')) {
        filteredList.push(company);
      }
    }

    filteredList.sort((a,b) => {
      let al = a.xp ? a.xp.length : 0;
      let bl = b.xp ? b.xp.length : 0;
      if(al == bl) {
        return (b.numberOfRatings || 0) - (a.numberOfRatings || 0);
      } else {
        return bl - al;
      }
    });

    return filteredList;
  };

  renderCard = (list, index, key) => {
    var sublist = list.slice(5*index, 5*index+5);
    return (
      <div className="rowB centering" key={index}>
        {sublist.map((c, i) => 
          {return <CompanyCard 
                    key={index+c.name+i} 
                    name={c.name} 
                    companyid={c.companyid} 
                    squareLogo={c.squareLogo} 
                    oc={c.oc} 
                    bookmarked={c.companyid in this.state.userCompanies && this.state.userCompanies[c.companyid].bookmarked}/>}
        )}
      </div>
    );
    // var c = list[index];
    // return <CompanyCard key={c.name} name={c.name} companyid={c.companyid} squareLogo={c.squareLogo} oc={c.oc}/>;
  };

  componentDidMount() {
    var db = firebase.firestore();
    // $.getJSON("/companies3.json", function(json) {
    //   var companies = json.companies;
    //   for(var i = 0; i<companies.length; i++) {
    //     var doc = companies[i];
    //     db.collection("companies").add(doc);
    //   }
    // });
    console.log("mounted")
    db.collection("companies").onSnapshot((querySnapshot) => {
      this.setState({
        companies: querySnapshot.docs.map((doc) => {return Object.assign({companyid: doc.id}, doc.data())})
      });
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          loggedIn: true
        });
        db.collection("users").doc(user.uid).collection("userCompanies").onSnapshot((querySnapshot) => {
          var userCompanies = {};
          for(var i=0; i<querySnapshot.docs.length; i++) {
            var doc = querySnapshot.docs[i];
            userCompanies[doc.id] = doc.data();
          }
          this.setState({
            userCompanies: userCompanies
          });
        });
      } else {
        this.setState({
          userCompanies: {}
        });
      }
    });

    //set up socket.io callbacks
    socket.on('numUsers', (numUsers) => {
      this.setState({
        usersOnline: numUsers
      });
    });
  }


  render() {
    var filteredList = this.filterCompanies();
    return (
      <div style={{fontFamily: 'Oxygen'}}>
        <div style={styles.bar} className="rowRL">
          <div className="rowC">
            <div style={{marginLeft: 16}}>
              {this.state.loggedIn ?
                <img src="/logo2.png" height={75} />
              :
                <div onTouchTap={this.signInGoogle} style={{cursor: 'pointer'}}>
                  <img src="/logo1.png" height={75} />
                </div>
              }
            </div>
            {this.state.searchQuery ? 
              <i className="material-icons" style={{fontSize: 40, margin: 16, color: grey400, cursor: 'pointer'}} onTouchTap={() => {this.setState({searchQuery: ""})}}>close</i>
            :
              <i className="material-icons" color={grey400} style={{fontSize: 40, margin: 16, color: grey400}}>search</i> 
            }
            <TextField
              hintText={'Search for places'  + " (" + this.state.companies.length + " total)"}
              value={this.state.searchQuery}
              underlineStyle={{display: 'none'}}
              style={{fontSize: 20, marginTop: 10, width: 400}}
              onChange={(event, value) => {this.setState({searchQuery: value})}}
            />
          </div>
          <div className="rowC">
            <div style={{marginTop: 27, marginRight: 27, color: grey500}}>{this.state.usersOnline + " users online"}</div>
            {this.state.sectorFilter == 'tech' ?
              <FlatButton
                label="Tech"
                style={{height: 75, borderRadius: 0, color: white}}
                icon={<FontIcon className="material-icons">code</FontIcon>}
                backgroundColor={cyanA400}
                hoverColor={cyanA700}
                onTouchTap={() => {this.setState({sectorFilter: ''})}}
              />
            :
              <FlatButton
                label="Tech"
                primary={true}
                style={{height: 75, borderRadius: 0}}
                icon={<FontIcon className="material-icons">code</FontIcon>}
                onTouchTap={() => {this.setState({sectorFilter: 'tech'})}}
              />
            }
            {this.state.sectorFilter == 'finance' ?
              <FlatButton
                label="Finance"
                style={{height: 75, borderRadius: 0, color: white}}
                icon={<FontIcon className="material-icons">timeline</FontIcon>}
                backgroundColor={cyanA400}
                hoverColor={cyanA700}
                onTouchTap={() => {this.setState({sectorFilter: ''})}}
              />
            :
              <FlatButton
                label="Finance"
                primary={true}
                style={{height: 75, borderRadius: 0}}
                icon={<FontIcon className="material-icons">timeline</FontIcon>}
                onTouchTap={() => {this.setState({sectorFilter: 'finance'})}}
              />
            }
            {this.state.sectorFilter == 'consulting' ?
              <FlatButton
                label="Consulting"
                style={{height: 75, borderRadius: 0, color: white}}
                icon={<FontIcon className="material-icons">collections_bookmark</FontIcon>}
                backgroundColor={cyanA400}
                hoverColor={cyanA700}
                onTouchTap={() => {this.setState({sectorFilter: ''})}}
              />
            :
              <FlatButton
                label="Consulting"
                primary={true}
                style={{height: 75, borderRadius: 0}}
                icon={<FontIcon className="material-icons">collections_bookmark</FontIcon>}
                onTouchTap={() => {this.setState({sectorFilter: 'consulting'})}}
              />
            }
            {this.state.ownFilter ?
              <FlatButton
                label="Only Mine"
                style={{height: 75, borderRadius: 0, color: white}}
                icon={<FontIcon className="material-icons">account_circle</FontIcon>}
                backgroundColor={amberA400}
                hoverColor={amberA700}
                onTouchTap={() => {this.setState({ownFilter: false})}}
              />
            :
              <FlatButton
                label="Only Mine"
                secondary={true}
                style={{height: 75, borderRadius: 0}}
                icon={<FontIcon className="material-icons">account_circle</FontIcon>}
                onTouchTap={() => {this.setState({ownFilter: true})}}
              />
            }
          </div>
        </div>
        <div style={{height: $(window).height() - 75, overflow: "auto"}}>
          {this.state.companies.length > 0 ?
            <div className="centering" style={{width: $(window).width()}}>
              <ReactList
                itemRenderer={this.renderCard.bind(null, filteredList)}
                length={filteredList.length}
                type='variable'
              />
            </div>
          :
            <div style={{marginTop: 30}} className='centering'>
              <CircularProgress size={80} thickness={5} />
            </div>
          }
        </div>
        <Dialog
          title="Information"
          actions={this.state.dialogActions || []}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.oc.closeDialog}
          autoScrollBodyContent={true}
        >
          {this.state.dialogJSX}
        </Dialog>
        <Drawer
          docked={false}
          width={700}
          openSecondary={true}
          open={this.state.drawerOpen}
          containerStyle={{zIndex: 1500}}
          onRequestChange={(open) => {this.setState({drawerOpen: open})}}
        >
          {this.state.drawerJSX}
        </Drawer>
        <Snackbar
          open={!this.state.loggedIn && !this.state.closeSnackbar}
          message={"Click the logo to log in"}
          action="OK"
          autoHideDuration={4000}
          onActionTouchTap={() => {this.setState({closeSnackbar: true})}}
          onRequestClose={() => {this.setState({closeSnackbar: true})}}
        />
      </div>
    );
  }
}

export default Home;
