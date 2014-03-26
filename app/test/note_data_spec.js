
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')
  var NoteData = require('note_data')

  return function() {

describe('NoteData', function() {

  it('#each should loop each note', function() {
    var spy = sinon.spy()
    var data = new NoteData([
      { beat: 0, value: 'AA', column: 1 },
      { beat: 0, value: 'BB', column: 2 },
      { beat: 2, value: 'CC', column: 2 },
    ])
    data.each(spy)
    sinon.assert.calledWith(spy, sinon.match({ value: 'AA' }))
    sinon.assert.calledWith(spy, sinon.match({ value: 'BB' }))
    sinon.assert.calledWith(spy, sinon.match({ value: 'CC' }))
  })

  it('#load should replace the current notes', function() {
    var spy = sinon.spy()
    var data = new NoteData()
    data.load([
      { beat: 0, value: 'WW', column: 1 },
      { beat: 0, value: 'BB', column: 2 },
      { beat: 2, value: 'CC', column: 2 },
    ])
    data.each(spy)
    sinon.assert.calledWith(spy, sinon.match({ value: 'WW' }))
    sinon.assert.calledWith(spy, sinon.match({ value: 'BB' }))
    sinon.assert.calledWith(spy, sinon.match({ value: 'CC' }))
    expect(data.length).to.equal(3)
  })

})

  }

})
