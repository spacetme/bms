
define(function(require) {

  var SoundTrackFactory = require('../sound_track')
  var bms = require('test_helper/bms')
  var expect = require('chai').expect
  var Desire = require('desire')
  var sinon  = require('sinon')
  
  return function() {

describe('SoundTrack', function() {

  var track, audio, SoundTrack, desire, timer

  beforeEach(function() {
    timer = { time: 0 }
    desire = new Desire({ 'game.timer': Desire.value(timer) })
    SoundTrack = new SoundTrackFactory(desire)
    audio = {
      start: sinon.spy(),
      stop:  sinon.spy()
    }
    track = new SoundTrack(audio)
  })

  it('should get the same slice for same time', function() {
    track.apply(function() {
      var a = track.slice(0.1)
      var b = track.slice(0.2)
      var c = track.slice(0.1)
      expect(a).to.equal(c)
    })
  })

  it('should get the different slice for different time', function() {
    track.apply(function() {
      var a = track.slice(0.1)
      var b = track.slice(0.2)
      var c = track.slice(0.1)
      expect(a).not.to.equal(b)
    })
  })

  describe('slice#play', function() {

    var clock, a, b, c, d

    beforeEach(function() {

      clock = sinon.useFakeTimers()

      var offset = 0

      Object.defineProperty(timer, 'time', {
        get: function() {
          // (now - start + set) ==> (start - set = offset)
          return (new Date().getTime() / 1000) - offset
        },
        set: function(time) {
          offset = (new Date().getTime() / 1000) - time
        }
      })

      track.apply(function() {
        a = track.slice(1)
        b = track.slice(2)
        c = track.slice(2.5)
        d = track.slice(4)
      })

    })

    it('just testing the fake timer...', function() {

      timer.time = 1.23
      clock.tick(100)
      expect(timer.time).to.be.closeTo(1.33, 0.001)
      
    })

    it('when hit, should play the sliced track', function() {

      timer.time = 20

      a.play('hit')
      sinon.assert.calledOnce(audio.start)
      sinon.assert.calledWith(audio.start, 1)
      clock.tick(1000)
      sinon.assert.calledOnce(audio.stop)

      audio.start.reset()
      audio.stop.reset()

      timer.time = 20
      b.play('hit')
      sinon.assert.calledOnce(audio.start)
      sinon.assert.calledWith(audio.start, 2)
      clock.tick(500)
      sinon.assert.calledOnce(audio.stop)

    })

    it('when auto, should play at that time', function() {

      timer.time = 1.7
      a.play('auto')
      sinon.assert.calledOnce(audio.start)
      sinon.assert.calledWith(audio.start, 1.7)

      clock.tick(300) // 2.0
      sinon.assert.calledOnce(audio.stop)

    })

    it('when both auto and hit, should hit first', function() {

      timer.time = 1.25
      a.play('auto')
      sinon.assert.calledWith(audio.start, 1.25)
      clock.tick(100) // 1.35

      b.play('hit')
      sinon.assert.calledWith(audio.start, 2)
      clock.tick(500) // 1.85
      
      sinon.assert.calledWith(audio.start, 1.85)
      sinon.assert.notCalled(audio.stop)
      clock.tick(250) // 2.0
      sinon.assert.calledOnce(audio.stop)

    })

    afterEach(function() {
      clock.restore()
    })

  })

})


  }

})
