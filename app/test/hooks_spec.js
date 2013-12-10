
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')

  var Hooks = require('hooks')

  return function test() {

describe('Hooks', function() {

  describe('with 4 hooks', function() {
    
    var hooks, f1, f2, f3, f4
    var ctx = { }

    beforeEach(function() {

      hooks = new Hooks()
      f1 = sinon.spy()
      f2 = sinon.spy()
      f3 = sinon.spy()
      f4 = sinon.spy()

      hooks.register({
        on: 'testing',
        order: 3,
        do: f1
      })

      hooks.register({
        on: 'trolol',
        order: 2,
        do: f2
      })

      hooks.register({
        on: 'testing',
        order: 1,
        do: f3
      })

      hooks.register({
        on: 'testing',
        order: 4,
        do: f4
      })
      
    })

    it('should call registered hooks', function() {
      hooks.run('testing', 'init', ctx)
      sinon.assert.callOrder(f3, f1, f4)
      sinon.assert.calledWith(f1, 'init')
      sinon.assert.calledWith(f3, 'init')
      sinon.assert.calledWith(f4, 'init')
      sinon.assert.calledOn(f1, ctx)
      sinon.assert.calledOn(f3, ctx)
      sinon.assert.calledOn(f4, ctx)
      sinon.assert.notCalled(f2)
    })

  })

})

  }

})
