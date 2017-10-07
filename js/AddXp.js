import React from 'react';
import {
  Paper, CircularProgress, Card, FlatButton, CardHeader, FontIcon,
  RadioButton, RadioButtonGroup, SelectField, TextField, DatePicker,
  MenuItem
} from 'material-ui';
import { green700, white, amber600, grey200, red400, red500, red600, blue200, blue400, blue500, deepOrange500, amber400,
          grey500, grey700, darkBlack, green500, yellow500, green400, green600, greenA700, grey400, amberA700,
          green200, red200, amber200, orange200, orange400, green50} from 'material-ui/styles/colors';

import SearchBar from 'material-ui-search-bar';

import CompanyProfile from './CompanyProfile';

const styles = {
  name: {
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: grey200,
    marginTop: 10,
    paddingTop: 8,
    fontSize: 16,
    fontFamily: 'Ubuntu',
    textAlign: 'center'
  },
  bookmark: {
    color: amberA700,
    position: 'absolute',
    top: 16,
    left: 37
  }
}

class AddXp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      medium: props.newXp.medium
    };
  }



  render() {
    return (
      <div>
        <div className="centering">
          <RadioButtonGroup name="xp" style={{width: '100%', marginTop: 16}} onChange={(event, value) => {this.props.editStateObject('newXp','nature', value)}}>
            <RadioButton
              value="Applied Here"
              label="I applied here"
              style={styles.radioButton}
            />
            <RadioButton
              value="Final Round"
              label="I went through the entire app process"
              style={styles.radioButton}
            />
            <RadioButton
              value="Offer"
              label="I got an offer"
              style={styles.radioButton}
            />
            <RadioButton
              value="Worked Here"
              label="I worked here"
              style={styles.radioButton}
            />
            <RadioButton
              value="None"
              label="None of the above"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </div>
        <div className="centering">
          <SelectField
            floatingLabelText="Applied through"
            onChange={(event, index, value) => {
              this.props.editStateObject('newXp','medium',value);
              this.setState({medium: value});
            }}
            fullWidth={true}
            value={this.state.medium}
          >
            <MenuItem value={"OCS/Crimson Careers"} primaryText="OCS/Crimson Careers" />
            <MenuItem value={"Company Website"} primaryText="Company Website" />
            <MenuItem value={"HR/Recruiter"} primaryText="HR/Recruiter" />
            <MenuItem value={"Referral"} primaryText="Referral" />
            <MenuItem value={"Other"} primaryText="Other" />
          </SelectField><br/>
          <DatePicker 
            floatingLabelText="Applied around" 
            mode="landscape" 
            fullWidth={true}
            onChange={(event, date) => {this.props.editStateObject('newXp','date',date.toLocaleDateString())}}
            style={{paddingLeft: 16}}
          /><br />
        </div>
        <div className="centering">
          <TextField
            floatingLabelText="What was your experience like?"
            fullWidth={true}
            multiLine={true}
            rows={3}
            rowsMax={10}
            onChange={(event, value) => {this.props.editStateObject('newXp','comments',value)}}
          /><br />
        </div>
        <div className="centering">
          <TextField
            floatingLabelText="What should people know when applying?"
            fullWidth={true}
            multiLine={true}
            rows={3}
            rowsMax={10}
            onChange={(event, value) => {this.props.editStateObject('newXp','advice',value)}}
          /><br />
        </div>
      </div>
    );
  }
}

export default AddXp;
