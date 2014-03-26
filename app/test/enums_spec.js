
define(function(require) {

  var enums = require('enums')
  var enumCheck = require('spec_helper/enum').check
  var expect = require('chai').expect
  var its = require('itself')
  
  return function() {
    
describe('enums', function() {

  var enumerable = enums.make(function(callback) {
    var array = ['doe', 'a', 'deer', 'a', 'female', 'deer']
    for (var i = 0; i < array.length; i ++) {
      if (false === callback(array[i])) return false
    }
  })

  describe('mock enum', function() {
    enumCheck(enumerable)
  })

  describe('::toArray', function() {
    it('should turn the enumerable into an array', function() {
      var filterer = its('.charAt(0) == "d"')
      var out = enums.toArray(enumerable)
      expect(out).to.deep.equal(['doe', 'a', 'deer', 'a', 'female', 'deer'])
    })
    enumCheck(['doe', 'a', 'deer', 3, 1, 4, 1, 5])
  })

  describe('::filter', function() {
    it('should filter the enumerable', function() {
      var filterer = its('.charAt(0) == "d"')
      var out = enums.filter(enumerable, filterer)
      expect(out).to.deep.equal(['doe', 'deer', 'deer'])
    })
  })

  describe('::map', function() {
    it('should map the enumerable', function() {
      var mapper = its('.length')
      var out = enums.map(enumerable, mapper)
      expect(out).to.deep.equal([3, 1, 4, 1, 6, 4])
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
