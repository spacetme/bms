
define(function(require) {

  var expect = require('chai').expect
  var delta = 0.0001
  var TimingData = require('timing_data')

  return function() {

describe('TimingData', function() {

  var timing

  beforeEach(function() {
    timing = new TimingData()
  })

  it('should not allow modification when not applying', function() {
    expect(function() {
      timing.add({ type: 'bpm', beat: 0, bpm: 60 })
    }).to.throw('apply')
  })

  it('should not allow nested apply', function() {
    expect(function() {
      timing.apply(function() {
        timing.apply(function() {
        })
      })
    }).to.throw('nested')
  })
  
  it('should be able to calculate from beat to seconds', function() {
    expect(timing.beatToSecond(-1)).to.be.closeTo(0, delta)
    timing.apply(function() {
      timing.add({ type: 'bpm', beat: 0, bpm: 30 })
      timing.add({ type: 'bpm', beat: 0.25, bpm: 90 })
      timing.add({ type: 'woohoo', beat: 1.2, bpm: 123, zoom: 20 })
      timing.add({ type: 'bpm', beat: 1, bpm: 60 })
      timing.add({ type: 'bpm', beat: 2, bpm: 192 })
      timing.add({ type: 'bpm', beat: 4, bpm: 600 })
    })
    expect(timing.beatToSecond(-1)).to.be.closeTo(-2, delta)
    expect(timing.beatToSecond(0)).to.be.closeTo(0, delta)
    expect(timing.beatToSecond(1)).to.be.closeTo(1, delta)
    expect(timing.beatToSecond(2)).to.be.closeTo(2, delta)
    expect(timing.beatToSecond(3)).to.be.closeTo(2 + 60 / 192, delta)
    expect(timing.beatToSecond(4)).to.be.closeTo(2 + 60 / 192 * 2, delta)
    expect(timing.beatToSecond(5)).to.be.closeTo(2.1 + 60 / 192 * 2, delta)
  })

  it('should be able to calculate seconds back to beat', function() {
    expect(timing.secondToBeat(100)).to.be.closeTo(0, delta)
    timing.apply(function() {
      timing.add({ type: 'bpm', beat: 0, bpm: 30 })
      timing.add({ type: 'bpm', beat: 0.25, bpm: 90 })
      timing.add({ type: 'bpm', beat: 1, bpm: 60 })
      timing.add({ type: 'bpm', beat: 2, bpm: 120 })
      timing.add({ type: 'bpm', beat: 3, bpm: 30 })
    })
    // 0 -> 0
    // 2 -> 2
    // 3 -> 2.5
    // 4 -> 4.5
    expect(timing.secondToBeat(-1)).to.be.closeTo(-0.5, delta)
    expect(timing.secondToBeat(0)).to.be.closeTo(0, delta)
    expect(timing.secondToBeat(1)).to.be.closeTo(1, delta)
    expect(timing.secondToBeat(2)).to.be.closeTo(2, delta)
    expect(timing.secondToBeat(3)).to.be.closeTo(3 + 0.5 * 30 / 60, delta)
    expect(timing.secondToBeat(4)).to.be.closeTo(3 + 1.5 * 30 / 60, delta)
    expect(timing.secondToBeat(10)).to.be.closeTo(4 + 5.5 * 30 / 60, delta)
  })

})

  }

})
