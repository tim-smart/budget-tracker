Meteor.autorun(function() {
  Meteor.subscribe('transactions', Session.get('sessionId') || 'public')
})
