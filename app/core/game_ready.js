
define(function(require) {

  var Synchronizer = require('./time_synchronizer')
  
  return function(desire) {

    var ready = { status: false }
    var state = desire('game.state')
    var timer = desire('game.timer')
    var synchronizer = new Synchronizer()

    ready.highlight = function() { return synchronizer.highlight() }
    ready.fire = fire

    return ready

    function fire() {
      var delay = synchronizer.start()
      if (!delay) {
        go()
      } else {
        setTimeout(go, delay)
      }
    }

    function go() {
      if (ready.status) return
      ready.status = true
      timer.bind()
    }
    
  }

})
