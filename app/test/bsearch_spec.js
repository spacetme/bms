
define(function(require) {

  var expect = require('chai').expect
  var bsearch = require('bsearch')
  
  return function() {

describe('bsearch', function() {

  describe('()', function() {
    var arr = [1, 4, 9, 16, 25, 49]
    
    it('must return the index of first item that return true', function() {
      expect(bsearch(arr, function(x) { return x >= 16 })).to.equal(3)
      expect(bsearch(arr, function(x) { return x >= 1 })).to.equal(0)
      expect(bsearch(arr, function(x) { return x >= 12 })).to.equal(3)
      expect(bsearch(arr, function(x) { return x >= 49 })).to.equal(5)
      expect(bsearch(arr, function(x) { return x >= 100 })).to.equal(null)
    })
  })

  describe('.first', function() {

    var arr = [1, 4, 9, 16, 25, 49]
    
    it('must return the first item that return true', function() {
      expect(bsearch.first(arr, function(x) { return x >= 16 })).to.equal(16)
      expect(bsearch.first(arr, function(x) { return x >= 1 })).to.equal(1)
      expect(bsearch.first(arr, function(x) { return x >= 12 })).to.equal(16)
      expect(bsearch.first(arr, function(x) { return x >= 40 })).to.equal(49)
      expect(bsearch.first(arr, function(x) { return x >= 0 })).to.equal(1)
      expect(bsearch.first(arr, function(x) { return x >= 100 })).to.equal(null)
    })
    
  })

  describe('.lastIndex', function() {

    var arr = [1, 4, 9, 16, 25, 49]
    
    it('must return the last index that return true', function() {
      expect(bsearch.lastIndex(arr, function(x) { return x < 16 })).to.equal(2)
      expect(bsearch.lastIndex(arr, function(x) { return x < 1 })).to.equal(null)
      expect(bsearch.lastIndex(arr, function(x) { return x < 12 })).to.equal(2)
      expect(bsearch.lastIndex(arr, function(x) { return x < 40 })).to.equal(4)
      expect(bsearch.lastIndex(arr, function(x) { return x < 0 })).to.equal(null)
      expect(bsearch.lastIndex(arr, function(x) { return x < 100 })).to.equal(5)
    })
    
  })

  describe('.last', function() {

    var arr = [1, 4, 9, 16, 25, 49]
    
    it('must return the last item that return true', function() {
      expect(bsearch.last(arr, function(x) { return x < 16 })).to.equal(9)
      expect(bsearch.last(arr, function(x) { return x < 1 })).to.equal(null)
      expect(bsearch.last(arr, function(x) { return x < 12 })).to.equal(9)
      expect(bsearch.last(arr, function(x) { return x < 40 })).to.equal(25)
      expect(bsearch.last(arr, function(x) { return x < 0 })).to.equal(null)
      expect(bsearch.last(arr, function(x) { return x < 100 })).to.equal(49)
    })
    
  })

})

  }

})
