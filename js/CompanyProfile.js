import React from 'react';

import {
  Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
  DropDownMenu, MenuItem, RaisedButton, FlatButton, IconButton,
  Drawer, TextField, Subheader, IconMenu, Avatar, SelectField,
  List, ListItem, Tabs, Tab, DatePicker, CircularProgress, Paper, FontIcon,
  RadioButton, RadioButtonGroup
} from 'material-ui';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { green700, white, amber600, grey200, red400, red500, red600, blue200, blue400, blue500, deepOrange500, amber400,
          grey500, grey700, darkBlack, green500, yellow500, green400, green600, greenA700, grey400,
          green200, red200, amber200, orange200, orange400, green50} from 'material-ui/styles/colors';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import PublicIcon from 'material-ui/svg-icons/social/public';
import PrivateIcon from 'material-ui/svg-icons/action/account-circle';
import StarIcon from 'material-ui/svg-icons/toggle/star';

import OfferTable from './OfferTable';
import ExperienceCard from './ExperienceCard';
import AddXp from './AddXp';

import {
  DropdownButton,
  Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';


const styles = {
  header: {
    fontFamily: 'Ubuntu'
  },
  subheader: {
    marginLeft: '-15px',
    marginRight: '-50px',
    fontSize: 20,
  },
  divider: {
    margin: '30px auto',
    width: '50%',
  },
  paper: {
    padding: 16,
    marginBottom: 5
  },
};

function round(n) {
  return Math.round(n * 100) / 100;
}

export default class CompanyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: {},
      userCompany: {},
      tab: 'a',
      newContact: {},
      newXp: {medium: "OCS/Crimson Careers"},
      newOffer: {},
      newNote: ""
    };
  }

  getCompany = (props) => {
    var db = firebase.firestore();
    db.collection("companies").doc(props.companyid).get().then((doc) => {
      if(doc.exists) {
        var company = doc.data();
        this.setState({
          company: company
        })
      }
    });

    var user = firebase.auth().currentUser;
    if(user && user.uid) {
      db.collection("users").doc(user.uid).collection("userCompanies").doc(this.props.companyid).get().then((doc) => {
        if(doc.exists) {
          console.log(doc.data())
          this.setState({
            userCompany: doc.data()
          });
        } else {
          this.setState({
            userCompany: {}
          });
        }
      });
    }
  };

  editCompany = (field, value) => {
    this.setState({
      company: Object.assign(this.state.company, {[field]: value})
    })
  };

  editStateObject = (object, field, value) => {
    this.setState({
      [object]: Object.assign(this.state[object], {[field]: value})
    });
  };

  updateUserCompany = (field, value) => {
    this.setState({
      userCompany: Object.assign(this.state.userCompany, {bookmarked: true}, {[field]: value})
    }, () => {
      var db = firebase.firestore();
      var user = firebase.auth().currentUser;
      if(user && user.uid) {
        db.collection("users").doc(user.uid).collection("userCompanies").doc(this.props.companyid).set(this.state.userCompany);
      }
    })
  };

  handleAddContact = () => {
    this.props.oc.openDialog(
      <div>
        <div className="centering">
          <TextField
            floatingLabelText="Contact name"
            fullWidth={true}
            onChange={(event, value) => {this.setState({newContact: Object.assign(this.state.newContact, {name: value})})}}
          /><br />
          <TextField
            floatingLabelText="Title (Optional)"
            fullWidth={true}
            onChange={(event, value) => {this.setState({newContact: Object.assign(this.state.newContact, {title: value})})}}
            style={{paddingLeft: 16}}
          /><br />
        </div>
        <div className="centering">
          <TextField
            floatingLabelText="Email"
            fullWidth={true}
            onChange={(event, value) => {this.setState({newContact: Object.assign(this.state.newContact, {email: value})})}}
          /><br />
        </div>
      </div>,
      [
        <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.props.oc.closeDialog}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onClick={() => {
            var { company, newContact } = this.state;
            if(newContact.name && newContact.email) {
              if(!company.contacts) company.contacts = [];
              //Add author info
              var user = firebase.auth().currentUser;
              newContact.author = user.displayName;
              newContact.authorid = user.uid;
              newContact.postDate = (new Date()).toLocaleDateString();
              //Add to company object
              company.contacts.push(newContact);
              this.setState({
                company: company,
                newContact: {}
              });
              //write to firestore
              var db = firebase.firestore();
              db.collection("companies").doc(this.props.companyid).update(this.state.company);
              this.props.oc.closeDialog();
            } else {
              this.props.oc.openSnackbar('Please fill out all required fields');
            }
          }}
        />,
      ]
    )
  };

  handleAddXp = () => {
    this.props.oc.openDialog(
      <div>
        <AddXp editStateObject={this.editStateObject} newXp={this.state.newXp} />
      </div>,
      [
        <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.props.oc.closeDialog}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onClick={() => {
            var { company, newXp } = this.state;
            if(newXp.nature && newXp.medium && newXp.date && newXp.advice && newXp.comments) {
              if(!company.xp) company.xp = [];
              //Add author info
              var user = firebase.auth().currentUser;
              newXp.author = user.displayName;
              newXp.authorid = user.uid;
              newXp.postDate = (new Date()).toLocaleDateString();
              //Add to company object
              company.xp.push(newXp);
              this.setState({
                company: company,
                newXp: {medium: "OCS/Crimson Careers"}
              }, () => {
                //write to firestore
                var db = firebase.firestore();
                db.collection("companies").doc(this.props.companyid).update(this.state.company);
              });
              this.props.oc.closeDialog();
            } else {
              this.props.oc.openSnackbar('Please fill out all fields');
            }
          }}
        />,
      ]
    );
  };

  handleAddOffer = () => {
    this.props.oc.openDialog(
      <div>
        <div className="centering">
          <RadioButtonGroup name="offer" style={{width: '100%', marginTop: 16}} onChange={(event, value) => {this.setState({newOffer: Object.assign(this.state.newOffer, {type: value})})}}>
            <RadioButton
              value="Internship"
              label="Internship"
              style={styles.radioButton}
            />
            <RadioButton
              value="Full-time"
              label="Full-time"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>
        <div className="centering">
          <TextField
            floatingLabelText="Salary"
            fullWidth={true}
            onChange={(event, value) => {this.setState({newOffer: Object.assign(this.state.newOffer, {salary: value})})}}
          /><br />
          <TextField
            floatingLabelText="Bonus(es)"
            fullWidth={true}
            onChange={(event, value) => {this.setState({newOffer: Object.assign(this.state.newOffer, {bonus: value})})}}
            style={{paddingLeft: 16}}
          /><br />
        </div>
        <DatePicker 
          floatingLabelText="Received around" 
          mode="landscape" 
          fullWidth={true}
          onChange={(event, date) => {this.setState({newOffer: Object.assign(this.state.newOffer, {date: date.toLocaleDateString()})})}}
        /><br />
      </div>,
      [
        <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.props.oc.closeDialog}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onClick={() => {
            var { company, newOffer } = this.state;
            if(newOffer.salary && newOffer.bonus && newOffer.date) {
              //Add author info
              var user = firebase.auth().currentUser;
              newOffer.author = user.displayName;
              newOffer.authorid = user.uid;
              newOffer.postDate = (new Date()).toLocaleDateString();
              //Add to comapny object
              if(!company.offers) company.offers = [];
              company.offers.push(newOffer);
              this.setState({
                company: company,
                newOffer: {}
              });
              //write to firestore
              var db = firebase.firestore();
              db.collection("companies").doc(this.props.companyid).update(this.state.company);
              this.props.oc.closeDialog();
            } else {
              this.props.oc.openSnackbar('Please fill out all fields');
            }
          }}
        />,
      ]
    )
  };

  handleEditNote = () => {
    this.props.oc.openDialog(
      <div>
        <div className="centering">
          <TextField
            floatingLabelText="Personal notes"
            fullWidth={true}
            multiLine={true}
            rows={3}
            rowsMax={10}
            onChange={(event, value) => {this.setState({newNote: value})}}
          /><br />
        </div>
      </div>,
      [
        <FlatButton
          label="Cancel"
          secondary={true}
          onClick={this.props.oc.closeDialog}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onClick={() => {
            this.updateUserCompany("notes", this.state.newNote);
            this.props.oc.closeDialog();
          }}
        />,
      ]
    )
  };

  componentDidMount() {
    this.getCompany(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getCompany(nextProps);
    console.log("Company ID", nextProps.companyid);
    //Reset state
    this.setState({
      tab: 'a',
      newContact: {},
      newXp: {medium: "OCS/Crimson Careers"},
      newOffer: {},
      newNote: ""
    })
  }

  render() {
    var divHeight = $(window).height() - 141;
    return (
      <div>
        <ListItem
          primaryText={this.state.company.name || "None"}
          secondaryText={<span>{(this.state.company.sectorName || "Miscellaneous")}<span style={{color: green400}}>{this.state.userCompany.status && (" | " + this.state.userCompany.status)}</span></span>}
          disabled={true}
          style={{backgroundColor: grey700, color: white}}
          leftIcon={
            this.state.userCompany.bookmarked ?
              <IconButton
                tooltip="Unbookmark"
                style={{marginTop: 0}}
                onTouchTap={() => {this.updateUserCompany('bookmarked', false)}}
              >
                <FontIcon className="material-icons" color={amber600}>bookmark</FontIcon>
              </IconButton>
            :
              <IconButton
                tooltip="Bookmark"
                style={{marginTop: 0}}
                onTouchTap={() => {this.updateUserCompany('bookmarked', true)}}
              >
                <FontIcon className="material-icons" color={amber600}>bookmark_outline</FontIcon>
              </IconButton>
          }
          rightIcon={
            <FlatButton
              label='Website'
              href={"http://" + this.state.company.website}
              target="_blank"
              icon={<FontIcon className="material-icons" color={white}>open_in_new</FontIcon>}
              style={{marginRight: 16, marginTop: 5, height: 36, width: 175, color: white}}
            />
          }
        />
        <Tabs
          value={this.state.tab}
          onChange={(value) => {this.setState({tab: value})}}
          tabItemContainerStyle={{backgroundColor: grey700}}
        >
          <Tab label="Community" value="a" icon={<PublicIcon/>} >
            <div style={{paddingLeft: '16px', paddingRight: '16px', height: divHeight, overflow: 'auto'}} ref='prof'>
              <PageHeader style={styles.header}>
                <span className="rowRL">
                  <span>General Info </span>
                  <span className="tooltip-container" style={{marginTop: -20, marginBottom: -10}}>
                    <i className="material-icons rotating-button teal" onTouchTap={this.props.oc.openSnackbar.bind(null, "Admin privileges required")}>mode_edit</i>
                  </span>
                </span>
              </PageHeader>
              <div style={{minHeight: 120}}>
                {this.state.company.general ||
                  <p>
                    <span style={{color: green400}}>Pros: </span>
                    {this.state.company.featuredReview && this.state.company.featuredReview.pros}
                    <br />
                    <span style={{color: red400}}>Cons: </span>
                    {this.state.company.featuredReview && this.state.company.featuredReview.cons}
                  </p>
                }
              </div>
              <PageHeader style={styles.header}>
                <span className="rowRL">
                  <span>Points of Contact</span>
                  <span className="tooltip-container" style={{marginTop: -20, marginBottom: -10}}>
                    <i className="material-icons rotating-button green" onTouchTap={firebase.auth().currentUser ? this.handleAddContact : this.props.oc.openSnackbar.bind(null,"Log in to add content")}>add</i>
                  </span>
                </span>
              </PageHeader>
              <div style={{minHeight: 120}}>
                {(this.state.company.contacts && this.state.company.contacts.length > 0) ?
                  <div>
                    {this.state.company.contacts.map((contact, index) => <div key={index}><strong>{contact.name + ": "}</strong>{contact.email}</div>)}
                  </div>
                :
                  "Email addresses of HR, etc."
                }
              </div>
              <PageHeader style={styles.header}>
                <span className="rowRL">
                  <span>Experiences & Tips </span>
                  <span className="tooltip-container" style={{marginTop: -20, marginBottom: -10}}>
                    <i className="material-icons rotating-button orange" onTouchTap={firebase.auth().currentUser ? this.handleAddXp : this.props.oc.openSnackbar.bind(null,"Log in to add content")}>add</i>
                  </span>
                </span>
              </PageHeader>
              <div style={{minHeight: 120}}>
                {this.state.company.xp ?
                  this.state.company.xp.map((xp, index) => {
                    return <ExperienceCard oc={this.props.oc} xp={xp} key={index}/>
                  })
                :
                  <div>No posts at this time. Add any thoughts you have on working or applying here.</div>
                }
              </div>
              <PageHeader style={styles.header}>
                <span className="rowRL">
                  <span>Offers </span>
                  <span className="tooltip-container" style={{marginTop: -20, marginBottom: -10}}>
                    <i className="material-icons rotating-button red" onTouchTap={firebase.auth().currentUser ? this.handleAddOffer : this.props.oc.openSnackbar.bind(null,"Log in to add content")}>add</i>
                  </span>
                </span>
              </PageHeader>
              <div style={{minHeight: 120}}>
                <div>Salary data from fellow students</div><br/>
                <OfferTable data={this.state.company.offers || []} />
              </div>
            </div>
          </Tab>
          <Tab label="My Details" value="b" icon={<PrivateIcon/>} >
            <div style={{paddingLeft: '16px', paddingRight: '16px', height: $(window).height() - 141, overflow: 'auto'}} ref='prof'>
              <SelectField
                floatingLabelText="Application Status"
                onChange={(event, index, value) => {this.updateUserCompany("status", value)}}
                fullWidth={true}
                disabled={!firebase.auth().currentUser}
                value={this.state.userCompany.status || 0}
              >
                <MenuItem value={0} primaryText="N/A" />
                <MenuItem value={"Applied"} primaryText="Applied" />
                <MenuItem value={"First Round Interview"} primaryText="First Round Interview" />
                <MenuItem value={"Later Rounds"} primaryText="Later Rounds" />
                <MenuItem value={"Final Rounds"} primaryText="Final Rounds" />
                <MenuItem value={"Offer"} primaryText="Offer" />
                <MenuItem value={"Rejected"} primaryText="Rejected" />
                <MenuItem value={"Accepted"} primaryText="Accepted" />
              </SelectField>
              <DatePicker 
                floatingLabelText="Start Date" 
                mode="landscape" 
                fullWidth={true}
                onChange={(event, date) => {this.updateUserCompany("startDate", date.toLocaleDateString())}}
                disabled={!firebase.auth().currentUser}
              />
              <PageHeader style={styles.header}>
                <span className="rowRL">
                  <span>Notes</span>
                  <span className="tooltip-container" style={{marginTop: -20, marginBottom: -10}}>
                    <i className="material-icons rotating-button teal" onTouchTap={firebase.auth().currentUser ? this.handleEditNote : this.props.oc.openSnackbar.bind(null,"Log in to add content")}>mode_edit</i>
                  </span>
                </span>
              </PageHeader>
              <div style={{minHeight: 120}}>
                {this.state.userCompany.notes || <div>None for now.</div>}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
