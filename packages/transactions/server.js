Meteor.publish('transactions', function(sessionId = 'public') {
  return BT.Transactions.find({sessionId: sessionId})
})
