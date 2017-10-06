import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import {
  BrowserRouter as Router,
  Route, Switch,
  Link
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import injectTapEventPlugin from 'react-tap-event-plugin';

import Home from './Home';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  amber600,
  teal700, teal800, green700,
  grey100, grey200, grey300, grey400, grey500, grey700,
  white, darkBlack, fullBlack, amberA700, cyanA400, cyanA700
} from 'material-ui/styles/colors';


let history = createBrowserHistory();
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: "Oxygen",
  palette: {
    primary1Color: cyanA700,
    accent1Color: amberA700,
    textColor: darkBlack,
    alternateTextColor: white,
    secondaryTextColor: grey300,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: darkBlack,
  },
});


firebase.firestore().enablePersistence()
  .then(function() {
      // Initialize Cloud Firestore through firebase
      var db = firebase.firestore();
  })
  .catch(function(err) {
      console.log(err);
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
  

ReactDOM.render((
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router>
      <Route exact path="/" component={Home}/>
    </Router>
  </MuiThemeProvider>
), document.getElementById('app'));
