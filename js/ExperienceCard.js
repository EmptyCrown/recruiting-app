import React from 'react';
import {
  Paper, CircularProgress, Card, FlatButton, Chip, CardHeader, CardText
} from 'material-ui';
import { grey300, blue300, amber300, green300, orange300, teal300} from 'material-ui/styles/colors';
import CompanyProfile from './CompanyProfile';

const styles = {
  name: {
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: 2,
    borderTopColor: 'grey',
    marginTop: 16,
    paddingTop: 16,
    fontSize: 20,
    fontFamily: 'Ubuntu'
  },
  chip: {
    borderRadius: 0,
    marginRight: 7
  }
}

const natureToColor = {
  "Applied Here": amber300,
  "Final Round": orange300,
  "Offer": teal300,
  "Worked Here": green300
}

class ExperienceCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Card style={{marginBottom: 10}}>
        <CardHeader
          title="Anonymous"
          subtitle={this.props.xp.date}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <div className="rowC">
            <Chip
              style={styles.chip}
              backgroundColor={natureToColor[this.props.xp.nature] || grey300}
            >
              {this.props.xp.nature}
            </Chip>
            <Chip
              style={styles.chip}
            >
              {this.props.xp.medium}
            </Chip>
          </div>
        </CardText>
        <CardText expandable={true}>
          <div><strong>What was your experience like?</strong></div>
          {this.props.xp.comments}
          <br />
          <br />
          <div><strong>What should people know when applying?</strong></div>
          {this.props.xp.advice}
        </CardText>
      </Card>
    );
  }
}

export default ExperienceCard;
