var firebase = require("firebase");
var add = require('./addSalaries.json');

var config = {
  apiKey: "AIzaSyC-jDaCS1ign-XFRt_VIt92TR81KqOB1ts",
  authDomain: "recrootiq.firebaseapp.com",
  databaseURL: "https://recrootiq.firebaseio.com",
  projectId: "recrootiq",
  storageBucket: "recrootiq.appspot.com",
  messagingSenderId: "887333704622"
};
firebase.initializeApp(config);

var newOffers = {};

firebase.database().ref('companies/').once('value', (snapshot) => {
  if(snapshot.val()) {
    var companies = snapshot.val();
    for(var key in add) {
      var s = add[key];
      for(var companyKey in companies) {
        var c = companies[companyKey];
        if(c.name == s.name) {
          newOffers[companyKey] = c.offers || [];
          newOffers[companyKey].push(s);
          
          break;
        }
      }
    }
    for(companyKey in newOffers) {
      firebase.database().ref('companies/'+companyKey).update({offers: newOffers[companyKey]});
    }
  };
});


