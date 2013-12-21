
define(function(require) {
  
  return function(desire) {

var notechart = desire('game.notechart')
var state = desire('game.state')

return { bind: bind }

function bind() {

  var columns = notechart.columns

  window.ontouchstart = window.ontouchmove = window.ontouchend = function(e) {
    var count = [ ], i
    for (i = 0; i < columns; i ++) count[i] = 0
    for (i = 0; i < e.touches.length; i ++) {
      var column = Math.floor(e.touches[i].clientX / window.innerWidth * 7)
      if (e.touches[i].clientY >= window.innerHeight * 5 / 6) column = 3
      count[column]++
    }
    for (i = 0; i < columns; i ++) {
      if (count[i] > 0) {
        state.press(i)
      } else {
        state.release(i)
      }
    }
    e.preventDefault()
  }

}



  }
})
