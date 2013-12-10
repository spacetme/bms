
define(function(require) {

  var enums = require('enums')
  var expect = require('chai').expect
  var its = require('itself')
  
  return function() {
    
describe('enums', function() {

  var enumerable = {
    each: function(callback) {
      var array = ['doe', 'a', 'deer', 'a', 'female', 'deer']
      for (var i = 0; i < array.length; i ++) {
        if (false === callback(array[i])) return false
      }
    }
  }

  describe('::toArray', function() {
    it('should turn the enumerable into an array', function() {
      var filterer = its('.charAt(0) == "d"')
      var out = enums.toArray(enumerable)
      expect(out).to.deep.equal(['doe', 'a', 'deer', 'a', 'female', 'deer'])
    })
  })

  describe('::filter', function() {
    it('should filter the enumerable', function() {
      var filterer = its('.charAt(0) == "d"')
      var out = enums.filter(enumerable, filterer)
      expect(out).to.deep.equal(['doe', 'deer', 'deer'])
    })
  })

  describe('Array', function() {
    it('should be augmented to become an enumerable', function() {
      var out = enums.toArray([1, 2, 3])
      expect(out).to.deep.equal([1, 2, 3])
    })
  })

})

  }

})
