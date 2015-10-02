Meteor.publish('categories', function(sessionId) {
  return BT.Categories.find({sessionId: sessionId})
})
