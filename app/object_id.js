
define(function(require) {

  var own = Object.prototype.hasOwnProperty
  var nextId = 0
  
  return function $id(obj) {
    if (typeof obj == 'object' || typeof obj == 'function') {
      if (obj == null) return '$$null'
      if (!own.call(obj, '$$id')) obj.$$id = '$' + (nextId++)
      return obj.$$id
    } else {
      return ':' + obj
    }
  }

})
