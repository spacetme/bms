
define(function(require) {

  return function ObjectPool(Component) {

    var pool = { }

    var instances = { }
    var deactivatedInstances = [ ]

    function getComponent(key) {
      if (key in instances) return instances[key]
      if (deactivatedInstances.length > 0) return deactivatedInstances.shift()
      return new Component()
    }

    var objects = null

    pool.begin = function() {
      objects = { }
    }

    pool.commit = function() {
      deactivateUnusedInstances()
      instances = objects
      objects = null
    }

    pool.use = use

    function use(data) {
      var key = Component.hashKey(data)
      var object = getComponent(key)
      object.set(data)
      objects[key] = object
      return object
    }

    function deactivateUnusedInstances() {
      for (var key in instances) {
        if (!(key in objects)) {
          deactivate(instances[key])
        }
      }
    }

    function deactivate(object) {
      object.deactivate()
      deactivatedInstances.push(object)
    }

    pool.update = function(fn) {
    
      pool.begin()
      fn(pool.use)
      pool.commit()

    }

    return pool

  }

})
