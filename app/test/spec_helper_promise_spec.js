
define(function(require) {
  
  var promise = require('spec_helper/promise')
  var when = require('when')

  return function() {

describe('a promise helper', function() {

  describe('::rejects', function() {
    it('should done with error when promise is resolved', function(done) {
      var fn = function() { return when.resolve(123) }
      promise.rejects(fn)(function(error) {
        if (error) done()
        else done(new Error('done should be called with an error'))
      })
    })
  })

  describe('::resolves', function() {
    it('should done with error when promise is rejected', function(done) {
      var fn = function() { return when.reject(new Error('wtf')) }
      promise.resolves(fn)(function(error) {
        if (error) done()
        else done(new Error('done should be called with an error'))
      })
    })
  })

})

  }

})
