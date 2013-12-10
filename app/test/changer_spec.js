
define(function(require) {
  
  var Changer = require('changer')
  var sinon = require('sinon')
  var expect = require('chai').expect
  
  return function() {
    
describe('changer', function() {

  it('must call only when it is changed', function() {

    var spy = sinon.spy()
    var changer = new Changer(spy, 10)
    changer(10)
    changer(20)
    changer(20)
    changer(30)
    changer(10)

    expect(spy.getCall(0).args[0]).equal(10)
    expect(spy.getCall(1).args[0]).equal(20)
    expect(spy.getCall(2).args[0]).equal(30)
    expect(spy.getCall(3).args[0]).equal(10)

  })
  
})

  }

})
