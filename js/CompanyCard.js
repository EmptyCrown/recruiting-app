import React from 'react';
import {
  Paper, CircularProgress, Card, FlatButton, CardHeader, FontIcon
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
    position: 'relative',
    top: -200,
    left: 12
  }
}

class CompanyCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Card 
        onTouchTap={
          () => {this.props.oc.openDrawer(
            <CompanyProfile oc={this.props.oc} companyid={this.props.companyid}/>
          )}
        }
        style={{margin:10, height: 230, width: 230, fontFamily: 'Raleway', backgroundColor: 'white', cursor: 'pointer', padding: 16}}
      >
        <div className="centering">
          <img src={this.props.squareLogo} width={150} height={150} />
        </div>
        <div className="centering" style={styles.name}>
          {this.props.name}
        </div>
        {this.props.bookmarked &&
          <FontIcon className="material-icons" style={styles.bookmark}>bookmark</FontIcon>
        }
      </Card>
    );
  }
}

export default CompanyCard;
