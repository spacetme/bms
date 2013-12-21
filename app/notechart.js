
define(function(require) {

  var _ = require('lodash')
  var TimingData = require('timing_data')
  var NoteData = require('note_data')
  var TimeSignatures = require('time_signatures')
  var BMS = require('bms')
  var Bukkit = require('bukkit')
  var Gimmick = require('gimmick')

  function eachEvent(bms, callback) {
    return _.each(bms.events, callback)
  }

  return function Notechart(bms, options) {

    options = options || { }

    var notechart = { }
    notechart.timeSignatures = loadTimesignatures()
    notechart.timing         = loadTiming()
    notechart.gimmick        = options.gimmick || new Gimmick()
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

    function getColumns() {
      var stats = { }
      eachEvent(bms, function(event) {
        if (BMS.isNote(event) && event.channel < 100) {
          var channel = event.channel
          if (channel >= 50) channel -= 40
          stats[channel] = (stats[channel] || 0) + 1
        }
      })
      return (
        make([16, 11, 12, 14, 15, 18], [16, 11, 12, 14, 15, 18], [13, 19]) ||
        make([11, 12, 13, 15, 18, 19], [11, 12, 13, 15, 18, 19], [16, 14]) ||
        make([16, 11, 12, 13, 14, 15], [16, 11, 12, 13, 14, 15], [18, 19]) ||
        make([11, 12, 13, 14, 15, 18], [11, 12, 13, 14, 15, 18], [16, 19]) ||
        make([16, 11, 12, 13, 14, 15, 18], [16], [19]) ||
        make([11, 12, 13, 14, 15, 18, 19], [], [])
      )
      function make(channels, requires, disallows) {
        for (var i = 0; i < requires.length; i ++) {
          if (!stats[requires[i]]) return false
        }
        for (i = 0; i < disallows.length; i ++) {
          if (stats[disallows[i]]) return false
        }
        return channels
      }
    }

    function loadNotes() {

      var notes = [ ]
      var heads = { }

      var columns = getColumns()
      notechart.columns = columns.length

      bms.events.sort(function(a, b) {
        return beat(a) - beat(b)
      })

      var noteEvents = extractGimmick(bms.events)
      
      noteEvents.forEach(function(event) {
        if (BMS.isNote(event)) {
          var eventBeat = beat(event)
          if (50 <= event.channel && event.channel < 70) { // long note
            if (!heads[event.channel]) {
              notes.push(heads[event.channel] = {
                column: column(event, columns),
                beat: eventBeat,
                value: event.value
              })
            } else {
              heads[event.channel].finish = eventBeat
              delete heads[event.channel]
            }
          } else { // other notes
            notes.push({
              column: column(event, columns),
              beat: eventBeat,
              value: event.value
            })
          }
        }
      })

      notes.forEach(function(note) {
        note.time = notechart.timing.beatToSecond(note.beat)
        if (note.finish) {
          note.finishTime = notechart.timing.beatToSecond(note.finish)
        }
      })

      return new NoteData(notes)

    }

    function extractGimmick(events) {
      var bukkits = {
        zoom: Bukkit(),
        scroll: Bukkit()
      }
      return notechart.gimmick.apply(function() {
        return events.filter(function(event) {
          var keysound = bms.keysounds[event.value]
          if (!keysound) return true
          var match = keysound.match(/^(\w+)(\W?=[\d\/\.]+)$/)
          if (!match) return true
          var eventBeat = beat(event)
          var name = match[1]
          var command = match[2]
          if (bukkits[name]) {
            notechart.gimmick[name](eventBeat, bukkits[name](command))
            return false
          }
          return true
        })
      })
    }

    function beat(event) {
      var measurePosition = +event.measure + (+event.position)
      return notechart.timeSignatures.measureToBeat(measurePosition)
    }

    function column(event, columns) {
      var channel = event.channel
      if (channel > 100) return 100 - channel
      if (channel >= 50) channel -= 40
      return _.indexOf(columns, channel)
    }

  }

})






