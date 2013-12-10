
define(function(require) {

  return function mixin(callback) {
    return {
      mix: function(object) {
        callback(object)
        return object
      }
    }
  }

})
