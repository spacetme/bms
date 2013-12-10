(function() {

var _ = this._ ? this._ : require('underscore')

var bms = {}

// Parse BMS data from string.
bms.parse = function(str) {

  var lines = str.split(/\n/)
    .map(function(x) { return x.replace(/^\s+|\s+$/g, '') })
    .filter(function(x) { return x.match(/^#/) })

  var headers = {}
    , events = []
    , measureSizes = {}
    , eventLinesToParse = []
    , bpms = {}
    , keysounds = {}
    , autoKeysoundChannels = {}

  // first, we look at each line
  lines.forEach(function(line) {
    var match
    if ((match = line.match(/^#(\d\d\d)(\d\d):(.+)/))) {
      // event line, queue it for later processing
      var measureNumber = parseInt(match[1], 10)
      var channelNumber = parseInt(match[2], 10)
      eventLinesToParse.push({
        measure: measureNumber
      , channel: channelNumber
      , content: match[3]
      })
    } else if ((match = line.match(/^#wav(..)\s+(.+)$/i))) {
      // keysound definition -- add it
      keysounds[match[1].toUpperCase()] = match[2]
    } else if ((match = line.match(/^#bpm(..)\s+(.+)$/i))) {
      // bpm definition -- remember it
      var bpm = parseFloat(match[2])
      if (isNaN(bpm)) {
        throw new Error('invalid bpm : ' + match[2])
      }
      bpms[match[1].toUpperCase()] = bpm
    } else if ((match = line.match(/^#(\w+)\s+(.+)$/))) {
      // header line -- add it
      headers[match[1].toLowerCase()] = match[2]
    }
  })

  // now parse each event lines
  eventLinesToParse.forEach(function(line) {
    parseEvent(line.measure, line.channel, line.content)
  })

  function parseEvent(measure, channel, content) {
    if (channel == 2) {
      // measure size
      var measureSize = parseFloat(content)
      if (isNaN(measureSize)) {
        throw new Error('invalid measure size')
      }
      measureSizes[measure] = measureSize
      return
    }
    if (channel == 1) {
      // auto keysound -- adjust its channel (> 100)
      channel = autoKeysoundChannels[measure]
        = (autoKeysoundChannels[measure] || 100) + 1
    }

    // loop through each object
    var count = Math.floor(content.length / 2)
    for (var i = 0; i < count; i ++) {

      var text = content.substr(i * 2, 2)
        , position = i / count
      if (text != '00') {
        var obj = { measure: measure, position: position }
        if (channel == 3) {
          // bpm (hex)
          obj.channel = 8
          obj.value = parseInt(text, 16)
          if (isNaN(obj.value)) throw new Error('invalid bpm: ' + text)
        } else if (channel == 8) {
          // bpm (ref)
          obj.channel = 8
          obj.value = bpms[text.toUpperCase()]
          if (!obj.value) throw new Error('invalid bpmref: ' + text)
        } else {
          // other
          obj.channel = channel
          obj.value = text.toUpperCase()
        }
        events.push(obj)
      }
    }
  }

  return {
    headers: headers
  , events: events
  , measureSizes: measureSizes
  , keysounds: keysounds
  }

}

// utility: find gcd using euclidean method
function gcd(a, b) {
  if (b > a) return gcd(b, a)
  if (b === 0) return a
  return gcd(b, a % b)
}

// stringify the bms object from parse
function stringify(bms) {
  var lines = []
    , k

  // pad with zero (3 digits)
  function pad(x) {
    var d = '000' + x
    return d.substr(d.length - 3)
  }

  // pad with zero (2 digits)
  function two(x) {
    var d = '00' + x
    return d.substr(d.length - 2)
  }

  // add headers
  for (k in bms.headers) {
    lines.push('#' + String(k).toUpperCase() + ' ' + bms.headers[k])
  }

  // add keysounds
  for (k in bms.keysounds) {
    lines.push('#WAV' + String(k).toUpperCase() + ' ' + bms.keysounds[k])
  }

  // add measure sizes
  for (k in bms.measureSizes) {
    if (Number(bms.measureSizes[k]) !== 1) {
      lines.push('#' + pad(k) + '02:' + bms.measureSizes[k])
    }
  }

  // now we build bpm definitions
  var bpms = {}
    , nextBpm = 1
  function allocBpm(bpm) {
    var id = two((nextBpm++).toString(36).toUpperCase())
    lines.push('#BPM' + id + ' ' + bpm)
    return id
  }

  var events = bms.events
        .map(function(event) {
          // process bpm events, convert them to either hex or ref bpm
          if (event.channel != 8) return event

          if (Math.abs(event.value - Math.round(event.value)) < 1.0e-5) {
            if (event.value > 0 && event.value <= 255) {
              // hex bpm
              return {
                measure: event.measure
              , position: event.position
              , channel: 3
              , value: two(Math.round(event.value).toString(16).toUpperCase())
              }
            }
          }

          // ref bpm
          var bpm = String(event.value)
            , id = bpms[bpm]
                || (bpms[bpm] = allocBpm(bpm))
          return {
            measure: event.measure
          , position: event.position
          , channel: 3
          , value: id
          }
        })

  // hold output lines, but for notes
  var noteLines = []

  // split events by measure
  var eventsByMeasure = _(events).groupBy(function(event) {
        return event.measure
      })
    , eventMeasures = _(eventsByMeasure).chain()
        .keys()
        .map(Number)
        .sortBy(Number)
        .value()

  // for each measure,
  eventMeasures.forEach(function(measureNumber) {
    var measureEvents = eventsByMeasure[measureNumber]

    // then split them by channel
    var byChannel = _(measureEvents).groupBy(function(event) {
          return event.channel
        })
      , channels = _(byChannel).chain()
          .keys()
          .map(Number)
          .sortBy(Number)
          .value()
      , measureCount = Math.round((bms.measureSizes[measureNumber] || 1) * 192)
    noteLines.push('')

    // for each channel,
    var lastAK = 101
    channels.forEach(function(channelIndex) {

      var channelText = two(channelIndex + '')
      if (channelIndex > 100) channelText = '01'

      // pad with blank autokeysound channel
      while (channelIndex > lastAK) {
        noteLines.push('#' + pad(measureNumber) + '01:00')
        lastAK++
      }

      // build position map
      var map = {}
        , positions = []
      byChannel[channelIndex].forEach(function(event) {
        var intPosition = Math.round(event.position * measureCount)
        positions.push(intPosition)
        map[intPosition] = event
      })

      // generate the actual bms data string
      var increment = positions.reduce(gcd, measureCount)
        , string = ''
      for (var i = 0; i < measureCount; i += increment) {
        if (map[i]) {
          var data = '00' + map[i].value
          string += data.substr(data.length - 2)
        } else {
          string += '00'
        }
      }
       
      noteLines.push('#' + pad(measureNumber) + channelText + ':' + string)

    })
  })

  return lines.concat(noteLines).join('\r\n')

}
bms.stringify = stringify

// compute and return a stat object for bms.
function stat(bms) {
  var object = {}

  // find max measure
  ;(function() {
    var maxMeasure = 0
    bms.events.forEach(function(event) {
      maxMeasure = Math.max(maxMeasure, event.measure)
    })
    ;(function() {
      for (var id in bms.measureSizes) {
        var measure = parseInt(id, 10)
        maxMeasure = Math.max(maxMeasure, measure)
      }
    })()
    object.maxMeasure = maxMeasure
  })()

  // row calculator table
  ;(function() {
    var data = []
      , start = 0
      , size = 192
    for (var i = 0; i <= object.maxMeasure; i ++) {
      size = Math.round(bms.measureSizes[i]
                        ? bms.measureSizes[i] * 192
                        : 192)
      data[i] = { start: start, size: size, end: start + size }
      start += size
    }
    object.measureStart = function(index) {
      return index < data.length
             ? data[index].start
             : data[data.length - 1].start
               + data[data.length - 1].size
               + (index - data.length + 1) * 192
    }
    object.measureSize = function(index) {
      return index < data.length ? data[index].size : 192
    }
    object.row = function(measure, position) {
      if (typeof measure == 'object') {
        if (measure.measure != null && measure.position != null) {
          return object.row(measure.measure, measure.position)
        }
      }
      return object.measureStart(measure)
             +  Math.round(object.measureSize(measure) * position)
    }
    object.fromRow = function(row) {
      for (var i = 0; i < data.length; i ++) {
        if (data[i].start <= row && row < data[i].end) {
          return { measure: i, position: (row - data[i].start) / data[i].size }
        }
      }
      var start = data[data.length - 1].end
      return {
        measure: Math.floor((row - start) / 192)
      , position: ((row - start) % 192) / 192
      }
    }
  })()

  return object
}
bms.stat = stat

// group notes by row (assume each event object has .row property)
function byRow(notes) {
  var notesByRow = _(notes).chain()
        .sortBy(function(event) { return event.value })
        .groupBy(function(event) {
          return event.row
        })
        .value()
    , noteRows = _(notesByRow).keys().map(Number)
  noteRows.sort(function(a, b) { return a - b; })
  return { rows: noteRows, map: notesByRow }
}
bms.byRow = byRow

// checks if the event is a note event
bms.isNote = function(event) {
  return 10 < event.channel && event.channel < 30
      || 50 < event.channel && event.channel < 70
      || 100 < event.channel
}

if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = bms
} else {
  this.BMS = bms
}

})()
