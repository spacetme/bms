
define(function(require) {

  var expect = require('chai').expect
  var sinon = require('sinon')
  var NoteData = require('note_data')
  var Entities = require('../entities')

  return function() {

describe('Entities', function() {

  function assertNoteValue(spy, value) {
    sinon.assert.calledWith(spy, sinon.match({
      note: sinon.match({ value: value })
    }))
  }

  it('#range should loop in a range', function() {
    var spy = sinon.spy()
    var data = new NoteData([
      { beat: 0, value: 'AA', column: 1 },
      { beat: 1, value: 'CC', column: 1 },
      { beat: 1.5, value: 'DD', column: 1 },
      { beat: 2, value: 'EE', column: 1 },
      { beat: 2.5, value: 'FF', column: 1 }
    ])
    var notes = new Entities(data)
    notes.range(1, 2).each(spy)
    sinon.assert.callCount(spy, 2)
    assertNoteValue(spy, 'CC')
    assertNoteValue(spy, 'DD')
  })

  it('#range should loop in a range with long notes', function() {
    var spy = sinon.spy()
    var data = new NoteData([
      { beat: 0, value: 'AA', column: 1 },
      { beat: 0.5, value: 'BB', column: 1, finish: 3 },
      { beat: 1, value: 'CC', column: 1 },
      { beat: 1.5, value: 'DD', column: 1 },
      { beat: 2, value: 'EE', column: 1 },
      { beat: 2.5, value: 'FF', column: 1 }
    ])
    var notes = new Entities(data)
    notes.range(1, 2).each(spy)
    sinon.assert.callCount(spy, 3)
    assertNoteValue(spy, 'BB')
    assertNoteValue(spy, 'CC')
    assertNoteValue(spy, 'DD')
  })

})
  
  }

})
