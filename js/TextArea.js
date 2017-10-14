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

class TextArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expanded: false
    };
  }

  render() {
    return (
      this.state.expanded ?
        <div>
          {this.props.children}
        </div>
      :
        <div className="overflow" style={{cursor: 'pointer'}} onTouchTap={() => this.setState({expanded: true})}>
          {this.props.children}
        </div>
    );
  }
}

export default TextArea;
