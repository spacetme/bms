
define(function(require) {

  return function(desire) {

var timer = desire('game.timer')
var notechart = desire('game.notechart')
var hook = desire('game.hook')
var state = { }

state.speed = 3

state.buttons = { }

state.press = function(column) {
  if (state.buttons[column]) return
  state.buttons[column] = true
  hook('game.column.down', { column: column })
}
state.release = function(column) {
  if (!state.buttons[column]) return
  state.buttons[column] = false
  hook('game.column.up', { column: column })
}

state.update = function() {
  state.time = timer.time - 5
  state.beat = notechart.timing.secondToBeat(state.time)
  state.position = state.beat
}

state.handleJudgment = function(event) {
  var combo = state.judgment ? state.judgment.combo : 0
  if (typeof event.result == 'number' && event.result <= 1) {
    combo += 1
  } else {
    combo = 0
  }
  state.judgment = { result: event.result, time: timer.time, combo: combo }
}

return state

  }
  
})
