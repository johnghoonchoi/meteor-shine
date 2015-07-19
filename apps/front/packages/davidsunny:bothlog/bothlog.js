// Write your package code here!
BothLog = {
  log: function(msg) {
    console.log(msg);
    Meteor.call('serverlog', msg);
  }
};
