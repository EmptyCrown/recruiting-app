var firebase = require("firebase");
var add = require('./addCompanies.json');

var config = {
  apiKey: "AIzaSyC-jDaCS1ign-XFRt_VIt92TR81KqOB1ts",
  authDomain: "recrootiq.firebaseapp.com",
  databaseURL: "https://recrootiq.firebaseio.com",
  projectId: "recrootiq",
  storageBucket: "recrootiq.appspot.com",
  messagingSenderId: "887333704622"
};
firebase.initializeApp(config);
console.log(add.companies.length);
firebase.database().ref('companies/').once('value', (snapshot) => {
  if(snapshot.val()) {
    var companies = snapshot.val();
    var names = Object.values(companies).map(function(x) {return x.name});

    for(var i = 0; i<add.companies.length; i++) {
      var c = add.companies[i];

      if(!names.includes(c.name)) {
        var newKey = firebase.database().ref('companies/').push().key;
        console.log(newKey)
        firebase.database().ref('companies/'+newKey).set(c);
      }
    }
  };
});


