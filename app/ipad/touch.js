
define(function(require) {
  
  return function(desire) {

var notechart = desire('game.notechart')
var state = desire('game.state')
var speed = desire('game.speed')

return { bind: bind }

function bind() {

  var columns = notechart.columns

  window.ontouchstart = window.ontouchmove = window.ontouchend = function(e) {
    var count = [ ], i
    var speeds = [ ]
    for (i = 0; i < columns; i ++) count[i] = 0
    for (i = 0; i < e.touches.length; i ++) {
      if (e.touches[i].clientY < 512) {
        speeds.push(e.touches[i].clientY)
      } else {
        var column = Math.floor(e.touches[i].clientX / window.innerWidth * 7)
        if (e.touches[i].clientY >= window.innerHeight * 5 / 6) column = 3
        count[column]++
      }
    }
    for (i = 0; i < columns; i ++) {
      if (count[i] > 0) {
        state.press(i)
      } else {
        state.release(i)
      }
    }
    updateSpeed(speeds)
    e.preventDefault()
  }

  var lastSpread = null
  function updateSpeed(speeds) {
    var currentSpread = getSpread(speeds)
    if (lastSpread == null && currentSpread != null) {
      speed.lock()
    } else if (lastSpread != null && currentSpread == null) {
      speed.unlock()
    } else if (lastSpread != null && currentSpread != null) {
      if (currentSpread >= 64 && lastSpread >= 64) {
        var newSpeed = speed.current * currentSpread / lastSpread
        speed.current = Math.max(0.33, Math.min(8.16, newSpeed))
        speed.set(speed.current)
      }
    }
    lastSpread = currentSpread
  }

  function getSpread(y) {
    if (y.length != 2) return null
    return Math.abs(y[0] - y[1])
  }

}



  }
})
