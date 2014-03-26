
define(function(require) {

  var _ = require('lodash')
  var bsearch = require('bsearch')
  
  return function NoteData(notes) {

    var notedata = { }

    notedata.load = function(newNotes) {
      notes = _.sortBy(newNotes, 'beat')
      notedata._notes = notes
      notedata.length = notes.length
    }

    notedata.each = function(callback) {
      return _.each(notes, callback)
    }

    if (notes) notedata.load(notes)

    return notedata

  }

})

