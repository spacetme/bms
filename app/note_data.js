
define(function(require) {

  var _ = require('lodash')
  var bsearch = require('bsearch')
  
  return function NoteData(notes) {

    notes = _.sortBy(notes, 'beat')
    
    var notedata = { _notes: notes }

    notedata.length = notes.length

    notedata.each = function(callback) {
      return _.each(notes, callback)
    }

    return notedata

  }

})

