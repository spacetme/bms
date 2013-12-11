
define(function(require) {

  return function(desire) {

var timer = desire('game.timer')
var notechart = desire('game.notechart')
var state = { }

state.speed = 3

state.buttons = { }

state.update = function() {
  state.beat = notechart.timing.secondToBeat(timer.time - 3)
  state.position = state.beat
}

return state

  }
  
})
