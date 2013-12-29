
define(function(require) {

  var Desire = require('desire')
  var GameMetrics = require('../game_metrics')

  var expect = require('chai').expect
  var delta = 0.0001
  var Gimmick = require('gimmick')
  
  return function() {

describe('GameMetrics', function() {

  var metrics, desire
  
  beforeEach(function() {
    metrics = GameMetrics(desire = new Desire({
      'game.theme': Desire.value({
        notes: {
          bottom: 700,
          top: 100,
          barHeight: 200
        }
      }),
      'game.state': Desire.value({
        position: 1,
      }),
      'game.speed': Desire.value({
        current: 2
      }),
      'game.gimmick': Desire.value(new Gimmick())
    }))
  })

  it('#visibleRange should return the positions for notes area', function() {

    var state = desire('game.state')
    var speed = desire('game.speed')

    expect(metrics.visibleRange(function(start, end) {
      expect(start).to.be.closeTo(1, delta)
      expect(end).to.be.closeTo(7, delta)
      return 'lol'
    })).to.equal('lol')

    state.position = 2

    metrics.visibleRange(function(start, end) {
      expect(start).to.be.closeTo(2, delta)
      expect(end).to.be.closeTo(8, delta)
    })

    speed.current = 1

    metrics.visibleRange(function(start, end) {
      expect(start).to.be.closeTo(2, delta)
      expect(end).to.be.closeTo(14, delta)
    })

  })

  it('#noteY should return the Y position for a note position', function() {

    // we send the entity too, to give it a context
    expect(metrics.noteY(1, { position: 1 })).to.equal(700)
    expect(metrics.noteY(2, { position: 2 })).to.equal(600)
    expect(metrics.noteY(3, { position: 3, finish: 5 })).to.equal(500)
    expect(metrics.noteY(5, { position: 3, finish: 5 })).to.equal(300)

  })

})

  }

})
