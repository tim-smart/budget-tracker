Meteor.autorun(function() {
  Meteor.subscribe('categories', Session.get('sessionId') || 'public')
})
