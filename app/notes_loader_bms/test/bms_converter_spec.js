
define(function(require) {

  var delta = 0.0001
  var convert = require('../bms_converter').convert
  var bms = require('spec_helper/bms')
  var Notechart = require('notechart')
  var enums = require('enums')
  var its = require('itself')

  return function() {

describe('bms_converter', function() {

  var notechart

  beforeEach(function() {
    notechart = new Notechart()
  })

  it('should add time signatures and BPM changes', function() {

    var timing = notechart.timing
    var ts = notechart.timeSignatures

    var add = sinon.spy(timing, 'add')
    var set = sinon.spy(ts, 'set')

    convert(bms(
      '#BPM 60',
      '#BPM01 600',
      '#00003:0000C0',
      '#00108:00010000',
      '#00002:0.75'
    ), notechart)

    sinon.assert.calledWith(set, 0, 0.75)

    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 0, bpm: 60 }))
    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 2, bpm: 192 }))
    sinon.assert.calledWith(add,
      sinon.match({ type: 'bpm', beat: 4, bpm: 600 }))

  })

  it('should list the notes', function() {

    convert(bms(
      '#BPM 120',
      '#00016:10',
      '#00011:0001',
      '#00012:00020003',
      '#00058:0001',
      '#00001:120012',
      '#00001:thunders',
      '#00158:01010001',
      '#00155:00xx0001'
    ), notechart)

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

  it('should handle columns', function() {

    convert(bms(
      '#00016:0100000000000000',
      '#00014:0000000005000000',
      '#00012:0000030000000000',
      '#00011:0002000000000000',
      '#00013:0000000400000000',
      '#00015:0000000000060000',
      '#00018:0000000000000700'
    ), notechart)

    expect(notechart.columns).to.equal(7)

    var columns = enums.map(notechart.notes, its('.column'))
    expect(columns).to.deep.equal([0, 1, 2, 3, 4, 5, 6])

  })

  it('should support lnobj', function() {

    convert(bms(
      '#LNOBJ XX',
      '#00011:01XX0002XX'
    ), notechart)

    expect(notechart.notes.length).to.equal(2)

    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy,
      sinon.match({ column: 0, beat: 0, value: '01', finish: 0.8 }))
    sinon.assert.calledWith(spy,
      sinon.match({ column: 0, beat: 2.4, value: '02', finish: 3.2 }))

  })

  it('notes should have time', function() {

    convert(bms(
      '#BPM 120',
      '#00016:10111213'
    ), notechart)
    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy, sinon.match({ time: 0 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 0.5 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 1 }))
    sinon.assert.calledWith(spy, sinon.match({ time: 1.5 }))

  })
  
  it('notes should have finishTime', function() {

    convert(bms(
      '#BPM 120',
      '#00016:10000000',
      '#00056:00100010'
    ), notechart)
    var spy = sinon.spy()
    notechart.notes.each(spy)

    sinon.assert.calledWith(spy, sinon.match({ finishTime: undefined }))
    sinon.assert.calledWith(spy, sinon.match({ finishTime: 1.5 }))

  })

  it('should add gimmicks', function() {

    var zoom = sinon.spy()
    var scroll = sinon.spy()
    var gimmick = {
          zoom: zoom,
          scroll: scroll,
          apply: function(x) {
            return x()
          }
        }

    notechart.gimmick = gimmick

    convert(bms(
      '#WAV01 zoom=1',
      '#WAV02 zoom=2',
      '#WAV03 zoom*=3',
      '#WAV04 zoom/=4',
      '#WAV11 scroll=1',
      '#WAV22 scroll+=3',
      '#WAV33 scroll*=2',
      '#WAV44 scroll/=4',
      '#WAV05 wtf/=4',
      '#WAV06 cool.wav',
      '#00101:01020304',
      '#00101:11223344',
      '#00101:05060708'
    ), notechart)

    sinon.assert.calledWith(zoom, 4, 1)
    sinon.assert.calledWith(zoom, 5, 2)
    sinon.assert.calledWith(zoom, 6, 6)
    sinon.assert.calledWith(zoom, 7, 1.5)
    sinon.assert.calledWith(scroll, 4, 1)
    sinon.assert.calledWith(scroll, 5, 4)
    sinon.assert.calledWith(scroll, 6, 8)
    sinon.assert.calledWith(scroll, 7, 2)

  })

  it('should load BMS info', function() {

    convert(bms(
      '#TITLE Wow',
      '#ARTIST Such Artist',
      '#GENRE Much Genre'
    ), notechart)

    expect(notechart.info.title).to.equal('Wow')
    expect(notechart.info.artist).to.equal('Such Artist')
    expect(notechart.info.genre).to.equal('Much Genre')

  })

})

  }

})
