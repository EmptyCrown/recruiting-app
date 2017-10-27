import React from 'react';
import io from 'socket.io-client';
import {
  Paper, CircularProgress, Dialog, FlatButton, Drawer, Badge,
  TextField, FontIcon, Snackbar, DatePicker, RaisedButton, ListItem
} from 'material-ui';
import { green700, white, amber600, grey200, red400, red500, red600, blue200, blue400, blue500, deepOrange500, amber400,
          grey500, grey700, darkBlack, green500, yellow500, green400, green600, greenA700, grey400, cyanA400, cyanA700,
          green200, red200, amber200, orange200, orange400, green50, amberA400, amberA700, pinkA400} from 'material-ui/styles/colors';
import SearchBar from 'material-ui-search-bar';

import ReactList from 'react-list';
import {
  DropdownButton,
  Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';

import CompanyCard from './CompanyCard';

const styles = {
  bar: {
    height: 75,
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: grey200
  },
  header: {
    fontFamily: 'Ubuntu',
    marginTop: -22
  },
  button: {
    background: 'linear-gradient(45deg, #24C6DC 30%, #514A9D 90%)',
    borderRadius: 3,
    fontWeight: 700,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(38,198,218, .30)',
    marginTop: 16,
    cursor: 'pointer'
  },
}

var socket = io();

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      companies: {},
      userCompanies: {},
      searchQuery: '',
      dialogOpen: false,
      drawerOpen: false,
      snackbarOpen: false,
      usersOnline: 1,
      seenInstructions: true
    };
    this.oc = {
      openDialog: ((jsx, actions, title) => {this.setState({dialogOpen: true, dialogJSX: jsx, dialogActions: actions, dialogTitle: title})}),
      closeDialog: (() => {this.setState({dialogOpen: false})}),
      openDrawer: ((jsx) => {this.setState({drawerOpen: true, drawerJSX: jsx})}),
      openSnackbar: ((message) => {this.setState({snackbarOpen: true, snackbarMessage: message})})
    };
  }

  handleLogoClick = () => {
    this.setState({
      sectorFilter: '',
      ownFilter: false
    });
  };

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
    for(var key in this.state.companies) {
      var company = Object.assign({},this.state.companies[key], {companyid: key});
      if((!this.state.searchQuery || company.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())) 
          && (!this.state.ownFilter || (!this.state.userCompanies || (company.companyid in this.state.userCompanies && this.state.userCompanies[company.companyid].bookmarked)))
          && (this.state.sectorFilter !== 'tech' || company.sectorName == 'Information Technology')
          && (this.state.sectorFilter !== 'finance' || company.sectorName == 'Finance')
          && (this.state.sectorFilter !== 'consulting' || company.sectorName == 'Business Services')) {
        filteredList.push(company);
      }
    }

    filteredList.sort((a,b) => {
      let al = 40*(a.xp ? a.xp.length : 0) + (a.offers ? a.offers.length : 0) + (a.contacts ? 15 : 0);
      let bl = 40*(b.xp ? b.xp.length : 0) + (b.offers ? b.offers.length : 0) + (b.contacts ? 15 : 0);
      if(al == bl) {
        return (b.numberOfRatings || 0) - (a.numberOfRatings || 0);
      } else {
        return bl - al;
      }
    });

    return filteredList;
  };

  renderCard = (list, index, key) => {
    var sublist = list.slice(4*index, 4*index+4);
    return (
      <div className="rowB centering" key={index}>
        {sublist.map((c, i) => 
          {return <CompanyCard 
                    key={index+c.name+i} 
                    name={c.name} 
                    companyid={c.companyid} 
                    squareLogo={c.squareLogo} 
                    oc={this.oc} 
                    c={Object.assign({},c)}
                    userc={Object.assign({},this.state.userCompanies[c.companyid] || {})}
                    bookmarked={c.companyid in this.state.userCompanies && this.state.userCompanies[c.companyid].bookmarked}/>}
        )}
      </div>
    );
  };

  showInstructions = () => {
    this.oc.openDialog(
      <div>
        <div>
          <strong>How it works</strong> <br/>
          This is a real-time community open only to Harvard students, where you can read and share experiences or advice in the recruiting process. 
          You'll also be able to find salary statistics, points of contact, and keep track of the companies you're interested in. It's like a Q-Guide for companies.
          <br />
          <br />
          <strong>How is this different from Glassdoor?</strong> <br/>
          We're hoping this will lead to quality personal information being shared that is more relevant to you as a Harvard student. You'll be able to discuss questions you have with fellow students.
          <br />
          <br />
          Log in with your .edu email address.
          <br />
          <br />
          Please submit bugs or new company requests to jessetanzhang@college.harvard.edu.
        </div>
      </div>,
      [
        <FlatButton
          label="No thanks, just here to view"
          primary={true}
          onClick={this.oc.closeDialog}
          style={{marginRight: 5}}
        />,
        <FlatButton
          label="Log in"
          backgroundColor={cyanA400}
          hoverColor={cyanA700}
          style={{color: white}}
          onClick={() => {
            this.signInGoogle();
            this.oc.closeDialog();
          }}
        />
      ],
      "Welcome to OfferIQ!"
    )
  };

  componentDidMount() {
    //FIREBASE IMPLEMENTATION
    firebase.database().ref('companies/').on('value', (snapshot) => {
      if(snapshot.val()) {
        this.setState({
          companies: snapshot.val()
        });
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          loggedIn: true
        });

        firebase.database().ref('users/'+user.uid).on('value', (snapshot) => {
          if(snapshot.val()) {
            this.setState({
              userCompanies: snapshot.val().userCompanies || {},
              seenInstructions: snapshot.val().seenInstructions
            });
          }
        });
      } else {
        this.setState({
          userCompanies: {},
        });
        this.showInstructions();
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
    var user = firebase.auth().currentUser;
    var filteredList = this.filterCompanies();
    return (
      <div style={{fontFamily: 'Oxygen'}}>
        <div style={styles.bar} className="rowRL">
          <div className="rowC">
            <div style={{marginLeft: 16, marginRight: 16}}>
              <div onTouchTap={this.handleLogoClick} style={{cursor: 'pointer'}}>
                <img src="/logo.png" height={35} style={{marginTop: 15}}/>
              </div>
            </div>
            {this.state.searchQuery ? 
              <i className="material-icons" style={{fontSize: 40, margin: 16, color: grey400, cursor: 'pointer'}} onTouchTap={() => {this.setState({searchQuery: ""})}}>close</i>
            :
              <i className="material-icons" color={grey400} style={{fontSize: 40, margin: 16, color: grey400}}>search</i> 
            }
            <TextField
              hintText={'Search for places'  + " (" + Object.keys(this.state.companies).length + " total)"}
              value={this.state.searchQuery}
              underlineStyle={{display: 'none'}}
              style={{fontSize: 20, marginTop: 10, width: 300}}
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
            {this.state.loggedIn ?
              (this.state.ownFilter ?
                <FlatButton
                  label={user.displayName.split(' ')[0]}
                  style={{height: 75, borderRadius: 0, color: white}}
                  icon={<FontIcon className="material-icons">bookmark</FontIcon>}
                  backgroundColor={amberA400}
                  hoverColor={amberA700}
                  onTouchTap={() => {this.setState({ownFilter: false})}}
                />
              :
                <FlatButton
                  label={user.displayName.split(' ')[0]}
                  secondary={true}
                  style={{height: 75, borderRadius: 0}}
                  icon={<FontIcon className="material-icons">bookmark</FontIcon>}
                  onTouchTap={() => {
                    this.setState({ownFilter: true}, () => {
                      if(this.filterCompanies().length == 0) {
                        this.oc.openSnackbar('Bookmark companies to add to your personal list');
                      }
                    });
                    
                  }}
                />
              )
            :
              <FlatButton
                label="Log in"
                secondary={true}
                style={{height: 75, borderRadius: 0}}
                icon={<FontIcon className="material-icons">account_circle</FontIcon>}
                onTouchTap={this.signInGoogle}
              />
            }
          </div>
        </div>
        <div style={{height: $(window).height() - 75, overflow: "auto"}}>
          {Object.keys(this.state.companies).length > 0 ?
            <div>
              <div className="centering" style={{width: $(window).width()}}>
                <ReactList
                  itemRenderer={this.renderCard.bind(null, filteredList)}
                  length={filteredList.length}
                  type='variable'
                />
              </div>
              {filteredList.length <= 4 &&
                <div className='centering'>
                  <ListItem style={styles.button} href="https://goo.gl/forms/GAoipZiVV4suEQLH2" target="_blank" leftIcon={<FontIcon className="material-icons" color={white}>add</FontIcon> }>
                    <span > Submit new companies to add</span>
                  </ListItem>
                </div>
              }
            </div>
          :
            <div style={{marginTop: 30}} className='centering'>
              <CircularProgress size={80} thickness={5} />
            </div>
          }
        </div>
        <Dialog
          title={this.state.dialogTitle || "Information"}
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
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage || ""}
          action="OK"
          autoHideDuration={4000}
          onActionTouchTap={() => {this.setState({snackbarOpen: false})}}
          onRequestClose={() => {this.setState({snackbarOpen: false})}}
        />
      </div>
    );
  }
}

export default Home;
