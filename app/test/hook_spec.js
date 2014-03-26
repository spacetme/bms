
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')

  var Hook = require('hook')

  return function test() {

    describe('Hook', function() {
      
      var fired
      beforeEach(function() { fired = Hook() })

      it('should run hook', function() {
        var a = sinon.spy()
        fired.do(a)
        fired.fire(1, 2, 3)
        sinon.assert.calledWith(a, 1, 2, 3)
      })

      it('should run hook in order', function() {
        var a = sinon.spy()
        var b = sinon.spy()
        var c = sinon.spy()
        fired.do(a, 1)
        fired.do(b, 3)
        fired.do(c, 2)
        fired.fire(1, 2, 3)
        sinon.assert.callOrder(a, c, b)
      })

    })

  }

})
