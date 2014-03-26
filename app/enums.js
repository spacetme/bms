
define(function(require) {

  var _ = require('lodash')
  
  /**
   * An enumerable is any object with the method each.
   */
  var enums = { }

  /**
   * A cool hack!
   */
  Object.defineProperty(Array.prototype, 'each', {
    value: function(callback) {
      for (var i = 0; i < this.length; i ++) {
        if (false === callback(this[i])) return false
      }
    },
    configurable: true,
    writable: true
  })

  enums.make = function(each) {
    return { each: each }
  }

  enums.toArray = function(enumerable) {
    var out = []
    enumerable.each(function(item) {
      out[out.length] = item
    })
    return out
  }

  enums.filter = function(enumerable, filterer) {
    return enums.toArray(enumerable).filter(filterer)
  }

  enums.map = function(enumerable, mapper) {
    return enums.toArray(enumerable).map(mapper)
  }

  return enums

})
