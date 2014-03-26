
/*jshint expr:true*/
define(function(require) {

  var StageManager = require('../stage_manager')
  var expect = require('chai').expect
  var sinon = require('sinon')
  
  return function() {

describe('StageManager', function() {

  var manager

  beforeEach(function() {
    manager = StageManager.mix({})
  })

  it('should have no current stage at first', function() {
    expect(manager.currentStage).to.be.null
  })

  describe('#push', function() {
    it('should set the current stage to the latest pushed stage', function() {
      var a = { }
      var b = { }
      manager.pushStage(a)
      expect(manager.currentStage).to.equal(a)
      manager.pushStage(b)
      expect(manager.currentStage).to.equal(b)
    })
  })

  describe('#pop', function() {
    it('should reverse the push', function() {
      var a = { }
      var b = { }
      manager.pushStage(a)
      manager.pushStage(b)
      manager.popStage()
      expect(manager.currentStage).to.equal(a)
    })
  })

  describe('#replace', function() {
    it('should replace the stage', function() {
      var a = { }
      var b = { }
      var c = { }
      manager.pushStage(a)
      manager.pushStage(b)
      manager.replaceStage(c)
      expect(manager.currentStage).to.equal(c)
      manager.popStage()
      expect(manager.currentStage).to.equal(a)
    })
  })

  describe('#forward', function() {
    it('should forward a message to the stage', function() {
      var a = { }
      var b = { lol: sinon.spy(), cat: sinon.spy() }
      var c = { cat: sinon.spy() }
      manager.pushStage(a)
      manager.pushStage(b)
      manager.pushStage(c)
      manager.forward('cat', 123)
      manager.forward('cat', 456)
      manager.forward('lol', 789)
      manager.popStage()
      manager.forward('cat', 321)
      manager.forward('lol', 654)
      manager.popStage()
      manager.forward('keypress', 'wat')
      manager.popStage()
      manager.forward('keypress', 'wat')
      sinon.assert.calledTwice(c.cat)
      sinon.assert.calledWith(c.cat, 123)
      sinon.assert.calledWith(c.cat, 456)
      sinon.assert.calledOnce(b.lol)
      sinon.assert.calledOnce(b.cat)
      sinon.assert.calledOn(b.lol, b)
    })
  })
  
})

  }

})
