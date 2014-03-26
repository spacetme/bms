
define(function(require) {

  return function() {

var promise = require('spec_helper/promise')
var Loader = require('../loader')

describe('loader', function() {

  var loader = Loader()

  it('should reject when no suitable handler', promise.rejects(function() {
    return loader.load('', 'wtf.haha')
  }))

  it('should call the appropriate notechart loader', promise.resolves(function() {
    loader.types['.b'] = function() {
      return 'yeah'
    }
    return loader.load('', 'wtf.b').then(function(result) {
      expect(result).to.equal('yeah')
    })
  }))

})

  }
  
})
