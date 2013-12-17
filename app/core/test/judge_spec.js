
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')
  var Notechart = require('notechart')
  var Desire = require('desire')
  var bms = require('test_helper/bms')
  var _ = require('lodash')
  var JudgeFactory = require('../judge')
  var components = { 'game.Judge': JudgeFactory }

  _.assign(components, require('../game_notes'))

  return function() {

describe('Judge', function() {

  var notechart = new Notechart(bms(
    '#BPM 120',
    '#00116:AABBCCDD',
    '#00111:FFGGHHIIJJ',
    '#00256:00EE0000',
    '#00356:0000EE00'
  ))

  components['game.hook'] = Desire.value(function() { })
  components['game.notechart'] = Desire.value(notechart)
  components['game.judgment'] = function(desire) {
    return { emit: sinon.spy() }
  }
  _.assign(components, require('../game_notes'))

  var base = new Desire(components)
  var desire, Judge, judge, items, judgment

  beforeEach(function() {
    desire = base.clone()
    Judge = desire('game.Judge')
    judgment = desire('game.judgment')
    judge = new Judge(0)
    items = judge._items
  })
  
  describe('(private)', function() {

    it('_items should have the notes in that column', function() {
      expect(items.length).to.equal(5)
    })

    it('_items should be sorted by beat', function() {
      expect(items[0].value).to.equal('AA')
      expect(items[1].value).to.equal('BB')
      expect(items[2].value).to.equal('CC')
      expect(items[3].value).to.equal('DD')
      expect(items[4].value).to.equal('EE')
    })

  })

  describe('update should call miss when judgment is miss', function() {

    beforeEach(function() {
      judgment.judge = sinon.stub()
    })

    it('1 note case', function() {
      judgment.judge.withArgs(items[0]).returns('miss')
      judgment.judge.withArgs(items[1]).returns(undefined)
      judge.update()
      sinon.assert.callCount(judgment.emit, 1)
      sinon.assert.calledWith(judgment.emit, 'miss')
    })

    it('zero note case', function() {
      judgment.judge.withArgs(items[0]).returns(1)
      judgment.judge.withArgs(items[1]).returns('miss')
      judge.update()
      sinon.assert.callCount(judgment.emit, 0)
    })

    it('multiple misses', function() {
      judgment.judge.withArgs(items[0]).returns('miss')
      judgment.judge.withArgs(items[1]).returns('miss')
      judgment.judge.withArgs(items[2]).returns(1)
      judgment.judge.withArgs(items[3]).returns(undefined)
      judge.update()
      sinon.assert.callCount(judgment.emit, 2)
      judgment.judge.withArgs(items[2]).returns('miss')
      judge.update()
      sinon.assert.callCount(judgment.emit, 3)
    })
    
  })

  describe('down', function() {

    beforeEach(function() {
      judgment.judge = sinon.stub()
      judgment.blank = sinon.stub()
    })

    it('should emit the judgment value when judgment is number', function() {
      judgment.judge.withArgs(items[0]).returns(1)
      judgment.judge.withArgs(items[1]).returns(2)
      judgment.judge.withArgs(items[2]).returns(1)
      judgment.judge.withArgs(items[3]).returns(undefined)
      judge.down()
      sinon.assert.calledWith(judgment.emit, 1)
      judgment.emit.reset()
      judge.down()
      sinon.assert.calledWith(judgment.emit, 2)
      judgment.emit.reset()
      judge.down()
      sinon.assert.calledWith(judgment.emit, 1)
      judgment.emit.reset()
      judge.down()
      sinon.assert.notCalled(judgment.emit)
      sinon.assert.calledOnce(judgment.blank)
    })

  })

  describe('up', function() {

    beforeEach(function() {
      judgment.judge = sinon.stub().returns(1)
      judgment.blank = sinon.stub()
      judgment.judgeRelease = sinon.stub()
    })

    it('should emit the judgment value when it is not undefined', function() {

      judgment.judgeRelease.withArgs(items[0]).returns(1)
      judgment.judgeRelease.withArgs(items[1]).returns(2)
      judgment.judgeRelease.withArgs(items[2]).returns('miss')
      judgment.judgeRelease.withArgs(items[3]).returns(undefined)

      judge.down()
      judgment.emit.reset()

      judge.up()
      sinon.assert.calledWith(judgment.emit, 1)

      judge.down()
      judgment.emit.reset()
      judge.up()
      sinon.assert.calledWith(judgment.emit, 2)

      judge.down()
      judgment.emit.reset()
      judge.up()
      sinon.assert.calledWith(judgment.emit, 'miss')

      judge.down()
      judgment.emit.reset()
      judge.up()
      sinon.assert.notCalled(judgment.emit)
    })

    it('should not judge when down returns undefined', function() {

      judgment.judge.withArgs(items[0]).returns(undefined)
      judgment.judgeRelease.withArgs(items[0]).returns(1)

      judge.down()
      judge.up()
      sinon.assert.notCalled(judgment.emit, 1)

    })
    
  })

})
    
  }

})
