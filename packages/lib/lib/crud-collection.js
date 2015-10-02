function getSessionId(sessionId) {
  return sessionId || 'public'
}

BT.crudCollection = function(className, collName, attributes) {

  BT[className] = new Ground.Collection(collName)

  const methods = {}

  methods[`${className}.create`] = function(sessionId, attr) {
    attr = _.pick(attr, attributes)
    attr.sessionId = sessionId
    attr.createdAt = new Date()
    attr.updatedAt = new Date()
    BT[className].insert(attr)
  }

  methods[`${className}.update`] = function(sessionId, id, attr) {
    attr = _.pick(attr, attributes)
    attr.sessionId = sessionId
    attr.updatedAt = new Date()
    BT[className].update({_id: id, sessionId: getSessionId(sessionId)}, attr)
  }

  methods[`${className}.remove`] = function(sessionId, id) {
    if (!id) {
      return
    }

    BT[className].remove({_id: id, sessionId: getSessionId(sessionId)})
  }

  methods[`${className}.removeAll`] = function(sessionId) {
    BT[className].remove({sessionId: getSessionId(sessionId)})
  }

  Meteor.methods(methods)
}
