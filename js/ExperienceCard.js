import React from 'react';
import {
  Paper, CircularProgress, Card, FlatButton
} from 'material-ui';
import SearchBar from 'material-ui-search-bar';

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
  }
}

class ExperienceCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Card>
        <CardHeader
          title="Without Avatar"
          subtitle="Subtitle"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={false}>
          {this.props.xp.text}
        </CardText>
      </Card>
    );
  }
}

export default ExperienceCard;
