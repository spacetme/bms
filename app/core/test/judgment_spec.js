
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')
  var Notechart = require('notechart')
  var Desire = require('desire')
  var bms = require('test_helper/bms')
  var _ = require('lodash')
  var Judgment = require('../judgment')
  var components = { 'game.judgment': Judgment }
  var enums = require('enums')

  return function() {

describe('Judgment', function() {

  components['game.hook'] = Desire.value(function() { })
  components['game.judgment.timing_window'] = Desire.value([0.1, 0.2, 0.4])
  components['game.state'] = function(desire) {
    return { time: 100 }
  }

  _.assign(components, require('../game_notes'))

  var base = new Desire(components)
  var desire
  var judgment

  beforeEach(function() {
    desire = base.clone()
    judgment = desire('game.judgment')
  })

  describe('judge', function() {
    it('should return correct judgment', function() {
      expect(judgment.judge({ time: 100 })).to.equal(0)
      expect(judgment.judge({ time: 100.05 })).to.equal(0)
      expect(judgment.judge({ time: 99.95 })).to.equal(0)
      expect(judgment.judge({ time: 100.15 })).to.equal(1)
      expect(judgment.judge({ time: 99.85 })).to.equal(1)
      expect(judgment.judge({ time: 100.3 })).to.equal(2)
      expect(judgment.judge({ time: 99.7 })).to.equal(2)
      expect(judgment.judge({ time: 120 })).to.equal(undefined)
      expect(judgment.judge({ time: 60 })).to.equal('miss')
    })
  })

  describe('judgeRelease', function() {
    it('should return correct judgment', function() {
      expect(judgment.judgeRelease({ finishTime: undefined })).to.equal(undefined)
      expect(judgment.judgeRelease({ finishTime: 100 })).to.equal(0)
      expect(judgment.judgeRelease({ finishTime: 100.05 })).to.equal(0)
      expect(judgment.judgeRelease({ finishTime: 99.95 })).to.equal(0)
      expect(judgment.judgeRelease({ finishTime: 100.15 })).to.equal(1)
      expect(judgment.judgeRelease({ finishTime: 99.85 })).to.equal(1)
      expect(judgment.judgeRelease({ finishTime: 100.3 })).to.equal(2)
      expect(judgment.judgeRelease({ finishTime: 99.7 })).to.equal(2)
      expect(judgment.judgeRelease({ finishTime: 120 })).to.equal('miss')
      expect(judgment.judgeRelease({ finishTime: 60 })).to.equal('miss')
    })
  })

})
    
  }

})
