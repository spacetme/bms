
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')
  var enumCheck = require('spec_helper/enum').check
  var TimeSignatures = require('time_signatures')
  var delta = 0.0001

  return function() {

describe('TimeSignatures', function() {

  describe('a blank one', function() {

    var ts

    beforeEach(function() {
      ts = new TimeSignatures()
    })

    it('should use 4 beats per measure', function() {
      expect(ts.measureToBeat(0)).to.be.closeTo(0, delta)
      expect(ts.measureToBeat(1)).to.be.closeTo(4, delta)
      expect(ts.measureToBeat(1000)).to.be.closeTo(4000, delta)
      expect(ts.beatToMeasure(0)).to.be.closeTo(0, delta)
      expect(ts.beatToMeasure(1)).to.be.closeTo(0.25, delta)
      expect(ts.beatToMeasure(1000)).to.be.closeTo(250, delta)
    })

  })

  describe('with some time signatures', function() {

    var ts

    beforeEach(function() {
      ts = new TimeSignatures()
      ts.apply(function() {
        // 0
        ts.set(1, 3 / 4) // 3
        ts.set(2, 7 / 8) // 6.5
        // 10.5
        ts.set(4, 5 / 4) // 15.5
      })
    })

    it('should convert correctly measure to beat', function() {
      expect(ts.measureToBeat(0)).to.be.closeTo(0, delta)
      expect(ts.measureToBeat(0.5)).to.be.closeTo(2, delta)
      expect(ts.measureToBeat(1)).to.be.closeTo(4, delta)
      expect(ts.measureToBeat(1.5)).to.be.closeTo(5.5, delta)
      expect(ts.measureToBeat(2)).to.be.closeTo(7, delta)
      expect(ts.measureToBeat(2.5)).to.be.closeTo(8.75, delta)
      expect(ts.measureToBeat(3)).to.be.closeTo(10.5, delta)
      expect(ts.measureToBeat(3.5)).to.be.closeTo(12.5, delta)
      expect(ts.measureToBeat(4)).to.be.closeTo(14.5, delta)
      expect(ts.measureToBeat(4.5)).to.be.closeTo(17, delta)
      expect(ts.measureToBeat(5)).to.be.closeTo(19.5, delta)
      expect(ts.measureToBeat(100)).to.be.closeTo(399.5, delta)
    })

    it('should convert correctly beat to measure', function() {
      expect(ts.beatToMeasure(0)).to.be.closeTo(0, delta)
      expect(ts.beatToMeasure(2)).to.be.closeTo(0.5, delta)
      expect(ts.beatToMeasure(4)).to.be.closeTo(1, delta)
      expect(ts.beatToMeasure(5.5)).to.be.closeTo(1.5, delta)
      expect(ts.beatToMeasure(7)).to.be.closeTo(2, delta)
      expect(ts.beatToMeasure(8.75)).to.be.closeTo(2.5, delta)
      expect(ts.beatToMeasure(399.5)).to.be.closeTo(100, delta)
    })

    describe('#range', function() {

      enumCheck(function() { return ts.range(-1, 11) })

      it('#range should loop time signatures from beat to beat', function() {
        var spy = sinon.spy()
        ts.range(-1, 11).each(spy)
        sinon.assert.callCount(spy, 4)
        sinon.assert.calledWith(spy, 0)
        sinon.assert.calledWith(spy, 1)
        sinon.assert.calledWith(spy, 2)
        sinon.assert.calledWith(spy, 3)
      })

    })

  })
  
})

  }

})
