
define(function(require) {

  var Notechart = require('notechart')
  var bms = require('test_helper/bms')
  var TimingData = require('timing_data')
  var TimeSignatures = require('time_signatures')

  var expect = require('chai').expect
  var sinon = require('sinon')
  var delta = 0.0001

  return function() {

describe('notechart', function() {

  it('should add time signatures and BPM changes', function() {

    var timing = new TimingData()
    var ts = new TimeSignatures()

    var add = sinon.spy(timing, 'add')
    var set = sinon.spy(ts, 'set')

    var notechart = new Notechart(bms(
      '#BPM 60',
      '#BPM01 600',
      '#00003:0000C0',
      '#00108:00010000',
      '#00002:0.75'
    ), { timing: timing, timeSignatures: ts })

    sinon.assert.calledWith(set, 0, 0.75)

    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 0, bpm: 60 }))
    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 2, bpm: 192 }))
    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 4, bpm: 600 }))

  })

  it('should list the notes', function() {

    var notechart = new Notechart(bms(
      '#BPM 120',
      '#00016:10',
      '#00011:0001',
      '#00012:00020003',
      '#00058:0001',
      '#00001:120012',
      '#00001:thunders',
      '#00158:01010001',
      '#00155:00xx0001'
    ))

    expect(notechart.notes.length).to.equal(13)

    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy,
      sinon.match({ column: 0, beat: 0, value: '10' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -1, beat: 0, value: '12' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -1, beat: 8/3, value: '12' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -2, beat: 0, value: 'TH' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -2, beat: 1, value: 'UN' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -2, beat: 2, value: 'DE' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: -2, beat: 3, value: 'RS' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 1, beat: 2, value: '01' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 2, beat: 1, value: '02' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 2, beat: 3, value: '03' }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 6, beat: 2, value: '01', finish: 4 }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 6, beat: 5, value: '01', finish: 7 }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 5, beat: 5, value: 'XX', finish: 7 }))

  })

  it('notes should have time', function() {

    var notechart = new Notechart(bms(
      '#BPM 120',
      '#00016:10111213'
    ))
    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy, sinon.match({ time: 0 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 0.5 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 1 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 1.5 }))

  })
  
  it('notes should have finishTime', function() {

    var notechart = new Notechart(bms(
      '#BPM 120',
      '#00016:10000000',
      '#00056:00100010'
    ))
    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy, sinon.match({ finishTime: undefined }))
    sinon.assert.calledWith(spy, sinon.match({ finishTime: 1.5 }))

  })

  it('should add gimmicks', function() {

    var timing = new TimingData()
    var ts = new TimeSignatures()
    var zoom = sinon.spy()
    var scroll = sinon.spy()
    var gimmick = {
          zoom: zoom,
          scroll: scroll,
          apply: function(x) {
            return x()
          }
        }

    var notechart = new Notechart(bms(
      '#WAV01 zoom=1',
      '#WAV02 zoom=2',
      '#WAV03 zoom*=3',
      '#WAV04 zoom/=4',
      '#WAV11 scroll=1',
      '#WAV22 scroll+=3',
      '#WAV33 scroll*=2',
      '#WAV44 scroll/=4',
      '#00101:01020304',
      '#00101:11223344'
    ), { gimmick: gimmick })

    sinon.assert.calledWith(zoom, 4, 1)
    sinon.assert.calledWith(zoom, 5, 2)
    sinon.assert.calledWith(zoom, 6, 6)
    sinon.assert.calledWith(zoom, 7, 1.5)
    sinon.assert.calledWith(scroll, 4, 1)
    sinon.assert.calledWith(scroll, 5, 4)
    sinon.assert.calledWith(scroll, 6, 8)
    sinon.assert.calledWith(scroll, 7, 2)

  })

})

  }

})
