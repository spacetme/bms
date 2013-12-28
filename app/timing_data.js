
define(function(require) {

  var _ = require('lodash')
  var bsearch = require('bsearch')
  var guardModification = require('guard_modification')
  
  return function TimingData() {

    var segments = [ ]
    var timing = { }

    timing._segments = segments

    guardModification(timing, function(guard) {

      timing.add = guard(function(segment) {
        segments.push(segment)
      })

      return optimize

    })

    timing.beatToSecond = function(beat) {
      var segment = last(function(item) { return beat >= item.beat })
      if (segment) {
        return segment.startTime + (beat - segment.beat) * 60 / segment.bpm
      } else if (segments.length >= 1) {
        return beat * 60 / segments[0].bpm
      } else {
        return 0
      }
    }

    timing.secondToBeat = function(second) {
      var segment = last(function(item) { return second >= item.startTime })
      if (segment) {
        return segment.beat + (second - segment.startTime) * segment.bpm / 60
      } else if (segments.length >= 1) {
        return second * segments[0].bpm / 60
      } else {
        return 0
      }
    }

    return timing

    // searches for a first thing that matches this criteria
    function last(fn) {
      return bsearch.last(segments, fn)
    }

    function optimize() {
      var time = 0
      var beat = 0
      var bpm = 60
      segments.sort(function(a, b) {
        return a.beat - b.beat
      })
      _.each(segments, function(segment) {
        time += (segment.beat - beat) * 60 / bpm
        segment.startTime = time
        if (segment.type == 'bpm') {
          bpm = +segment.bpm
        }
        beat = segment.beat
      })
    }

  }

})
