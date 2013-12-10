
/*jshint expr:true*/
define(function(require) {

  var mixin = require('mixin')
  var expect = require('chai').expect
  
  return function() {

describe('mixin', function() {

  var mixer = mixin(function(object) {
        object.a = 1
      })

  it('should return a mixer', function() {
    expect(mixer.mix).not.to.be.undefined
  })

  it('should mix an object', function() {
    var x = { b: 5 }
    expect(mixer.mix(x)).to.equal(x)
    expect(x.a).to.equal(1)
  })
  
})

  }

})
