
define(function(require) {

  var _ = require('lodash')
  var TimingData = require('timing_data')
  var NoteData = require('note_data')
  var TimeSignatures = require('time_signatures')
  var BMS = require('bms')

  function eachEvent(bms, callback) {
    return _.each(bms.events, callback)
  }

  return function Notechart(bms, options) {

    options = options || { }

    var notechart = { }
    notechart.timeSignatures = loadTimesignatures()
    notechart.timing         = loadTiming()
    notechart.notes          = loadNotes()

    return notechart

    function loadTiming() {
      var timing = options.timing || new TimingData()
      timing.apply(function() {
        timing.add({
          type: 'bpm',
          beat: 0,
          bpm: (+bms.headers.bpm) || 60
        })
        eachEvent(bms, function(event) {
          if (event.channel == 8) {
            timing.add({
              type: 'bpm',
              beat: beat(event),
              bpm: event.value
            })
          }
        })
      })
      return timing
    }

    function loadTimesignatures() {
      var ts = options.timeSignatures || new TimeSignatures()
      ts.apply(function() {
        for (var i in bms.measureSizes) {
          if (typeof bms.measureSizes[i] == 'number') {
            ts.set(+i, bms.measureSizes[i])
          }
        }
      })
      return ts
    }

    function loadNotes() {

      var notes = [ ]
      var heads = { }

      bms.events.sort(function(a, b) {
        return beat(a) - beat(b)
      })

      eachEvent(bms, function(event) {
        if (BMS.isNote(event)) {
          var eventBeat = beat(event)
          if (50 <= event.channel && event.channel < 70) { // long note
            if (!heads[event.channel]) {
              notes.push(heads[event.channel] = {
                column: column(event),
                beat: eventBeat,
                value: event.value
              })
            } else {
              heads[event.channel].finish = eventBeat
              delete heads[event.channel]
            }
          } else { // other notes
            notes.push({
              column: column(event),
              beat: eventBeat,
              value: event.value
            })
          }
        }
      })

      notes.forEach(function(note) {
        note.time = notechart.timing.beatToSecond(note.beat)
      })

      return new NoteData(notes)

    }

    function beat(event) {
      var measurePosition = +event.measure + (+event.position)
      return notechart.timeSignatures.measureToBeat(measurePosition)
    }

    function column(event) {
      var channel = event.channel
      if (channel > 100) return 100 - channel
      if (channel >= 50) channel -= 40
      return _.indexOf([16, 11, 12, 13, 14, 15, 18], channel)
    }

  }

})






