
if (typeof define !== 'function') {
  var define = require('amdefine')(module)
}
if (typeof WebSocket == 'undefined') {
  var WebSocket = require('ws')
}

define(function(require) {

  var timesync = require('./timesync')

  return { sync: sync }

  function sync(url, callback) {
    var ws = new WebSocket(url)
    var clocks = []
    ws.onmessage = function(e) {
      if (e.data == 'k') {
        emit()
      }
      if (e.data.indexOf(',') >= 0) {
        process(e.data)
        emit()
      }
    }
    ws.onclose = function() {
      if (clocks.length < 1) return callback(new Error('no offset received'))
      return callback(null, timesync.offset(clocks))
    }
    function emit() {
      ws.send('' + new Date().getTime())
    }
    function process(text) {
      var fields = text.split(',')
      var a = +fields[0]
      var b = +fields[1]
      var c = new Date().getTime()
      if (a <= c) clocks.push(timesync.convert([a, b, b, c]))
    }
  }

})


