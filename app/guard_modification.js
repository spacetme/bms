
define(function(require) {
  
  return function guardModification(object, callback) {

    var applying = false
    
    function guard(fn) {
      return function guarded() {
        if (!applying) {
          throw new Error('Modifications to this object must be called using apply.')
        }
        return fn.apply(this, arguments)
      }
    }

    function apply(callback) {
      if (applying) {
        throw new Error('apply() calls must not be nested')
      }
      try {
        applying = true
        var result = callback()
        if (optimize) optimize()
        return result
      } finally {
        applying = false
      }
    }

    object.apply = apply
    apply.guard = guard

    var optimize = callback(guard)

    return apply

  }

})
