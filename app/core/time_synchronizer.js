
define(function(require) {

  var timesync = require('timesync')
  var client = require('timesync/client')

  return function Synchronizer() {

    var synchronizer = { }
    var period = 1000
    var offset

    function now() {
      return new Date().getTime() + offset
    }

    client.sync('ws://vps.dt.in.th:1357/', function(error, result) {
      offset = result
    })

    synchronizer.highlight = function() {
      if (offset == null) return 0
      var time = now()
      var phase = (time % period) / period
      if (phase < 0.5) return 0
      return (1 - phase) * 2
    }

    synchronizer.start = function() {
      if (offset == null) return null
      var time = now()
      var phase = (time % period) / period
      if (phase < 0.2) return null
      if (phase > 0.8) return null
      return period - (time % period)
    }


    return synchronizer
    
  }

})
