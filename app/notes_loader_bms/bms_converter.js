
define(function(require) {
  
  var _ = require('lodash')
  var Bukkit = require('bukkit')
  var BMS = require('bms')

  function eachEvent(bms, callback) {
    return _.each(bms.events, callback)
  }

  return { convert: convert }
  
  function convert(bms, notechart) {

    var usedKeysound = { }

    loadTimesignatures()
    loadTiming()
    loadNotes()
    loadMetadata()
    loadKeysounds()

    function loadTimesignatures() {
      var ts = notechart.timeSignatures
      ts.apply(function() {
        for (var i in bms.measureSizes) {
          if (typeof bms.measureSizes[i] == 'number') {
            ts.set(+i, bms.measureSizes[i])
          }
        }
      })
    }

    function loadTiming() {
      var timing = notechart.timing
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
      var last = { }

      var columns = getColumns()
      notechart.columns = columns.length

      bms.events.sort(function(a, b) {
        return beat(a) - beat(b)
      })

      var noteEvents = extractGimmick(bms.events)
      var lnobj = bms.headers.lnobj && bms.headers.lnobj.toLowerCase()
      
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
            if (lnobj && event.value.toLowerCase() == lnobj) {
              last[event.channel].finish = eventBeat
            } else {
              notes.push(last[event.channel] = {
                column: column(event, columns),
                beat: eventBeat,
                value: event.value
              })
            }
          }
        }
      })

      notes.forEach(function(note) {
        note.time = notechart.timing.beatToSecond(note.beat)
        if (note.finish) {
          note.finishTime = notechart.timing.beatToSecond(note.finish)
        }
      })

      notechart.notes.load(notes)

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
          var match = keysound.match(/^(\w+)(\W?=[\d\/\.]+[!]?)$/)
          if (!match) {
            usedKeysound[event.value] = true
            return true
          }
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

    function loadKeysounds() {
      _.forOwn(bms.keysounds, function(value, key) {
        var filename = value
              .replace(/\\/g, '/')
              .replace(/^\//, '')
              .split('/').map(encodeURIComponent).join('/')
        if (usedKeysound[key]) {
          notechart.keysounds[key] = { path: filename, type: 'file' }
        }
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

    function loadMetadata() {
      var map = {
        title: 'title',
        artist: 'artist',
        genre: 'genre'
      }
      _.forOwn(map, function(target, source) {
        if (bms.headers[source]) notechart.info[target] = bms.headers[source]
      })
    }

  }

})





