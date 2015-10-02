function getSessionId(sessionId) {
  return sessionId || 'public'
}

BT.crudCollection = function(className, collName, attributes) {

  attributes = _.union(['createdAt', 'updatedAt', 'sessionId'], attributes)
  BT[className] = new Mongo.Collection(collName)

  const methods = {}

  methods[`${className}.create`] = function(sessionId, attr) {
    attr = _.pick(attr, attributes)
    attr.sessionId = sessionId
    attr.createdAt = new Date()
    attr.updatedAt = new Date()
    return BT[className].insert(attr)
  }

  methods[`${className}.update`] = function(sessionId, id, attr) {
    attr = _.pick(attr, attributes)
    attr.updatedAt = new Date()
    BT[className].update(id, attr)
  }

  methods[`${className}.remove`] = function(sessionId, id) {
    if (!id) {
      return
    }

    BT[className].remove(id)
  }

  methods[`${className}.removeAll`] = function(sessionId) {
    BT[className].remove({sessionId: getSessionId(sessionId)})
  }

  Meteor.methods(methods)

  if (Meteor.isServer) {
    Meteor.publish(collName, function(sessionId = 'public') {
      return BT[className].find({sessionId: sessionId})
    })
  }

  if (Meteor.isClient) {
    Meteor.autorun(function() {
      BT[collName + 'Sub'] = Meteor.subscribe(collName, Session.get('sessionId') || 'public')
    })
  }
}
