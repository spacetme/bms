
define(function(require) {
  
  var expect = require('chai').expect
  var $id = require('object_id')

  return function() {

describe('$id', function() {

  it('should return same value for same object', function() {
    var a = { }
    expect($id(a)).to.equal($id(a))
    expect($id(1)).to.equal($id(1))
    expect($id('abc')).to.equal($id('abc'))
  })

  it('should return different value for different object', function() {
    var a = { }
    var b = { }
    expect($id(b)).not.to.equal($id(a))
    expect($id(1)).not.to.equal($id(2))
    expect($id('abc')).not.to.equal($id('def'))
  })
  
})

  }

})
