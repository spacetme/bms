
define(function(require) {

  var guardModification = require('guard_modification')
  var bsearch = require('bsearch')
  
  return function TimeSignatures() {
    
    var ts = { }
    var measureSizes = [ ]
    var measureStarts = [ 0 ]

    function measureSize(num) {
      return (measureSizes[num] || 1) * 4
    }

    guardModification(ts, function(guard) {

      ts.set = guard(function(measureNumber, timeSignature) {
        measureSizes[measureNumber] = timeSignature
      })

      return function optimize() {
        var beat = 0
        measureStarts.length = 0
        for (var i = 0; i < measureSizes.length; i ++) {
          measureStarts[i] = beat
          var size = measureSize(i)
          beat += size
        }
        measureStarts[i] = beat
      }

    })

    ts.measureToBeat = function(measure) {
      var whole = Math.floor(measure)
      var fraction = measure - whole
      if (measure >= measureSizes.length) {
        return measureStarts[measureSizes.length] + (measure - measureSizes.length) * 4
      } else {
        return measureStarts[whole] + fraction * measureSize(whole)
      }
    }

    ts.beatToMeasure = function(beat) {
      if (beat >= measureStarts[measureStarts.length - 1]) {
        return measureSizes.length + (beat - measureStarts[measureStarts.length - 1]) / 4
      } else {
        var index = bsearch.lastIndex(measureStarts, function(start) { return beat >= start })
        if (index == null) return 0
        return index + (beat - measureStarts[index]) / measureSize(index)
      }
    }

    return ts

  }

})
