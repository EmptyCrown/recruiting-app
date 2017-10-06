import React from 'react';
import {
  Paper, CircularProgress, Card, FlatButton
} from 'material-ui';
import { green700, white, amber600, grey200, red400, red500, red600, blue200, blue400, blue500, deepOrange500, amber400,
          grey500, grey700, darkBlack, green500, yellow500, green400, green600, greenA700, grey400,
          green200, red200, amber200, orange200, orange400, green50} from 'material-ui/styles/colors';

import ReactTable from "react-table";

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
  }
}

class OfferTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.data}
          columns={[
            {
              Header: "Date",
              accessor: "date"
            },
            {
              Header: "Type",
              accessor: "type"
            },
            {
              Header: "Salary",
              accessor: "salary"
            },
            {
              Header: "Bonus",
              accessor: "bonus"
            },
          ]}
          defaultSorted={[
            {
              id: "date",
              desc: true
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

export default OfferTable;
