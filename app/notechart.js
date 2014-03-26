
define(function(require) {

  var _ = require('lodash')

  var TimingData = require('timing_data')
  var NoteData = require('note_data')
  var TimeSignatures = require('time_signatures')
  var Gimmick = require('gimmick')

  return function Notechart() {

    var notechart = { }
    notechart.timeSignatures = new TimeSignatures()
    notechart.timing         = new TimingData()
    notechart.gimmick        = new Gimmick()
    notechart.notes          = new NoteData()
    notechart.info           = {
      title:  'Untitled',
      artist: 'Unknown Artist',
      genre:  'Non-Genre'
    }

    return notechart

  }

})






