
define(function(require) {

  var bsearch = require('bsearch')
  
  return function(desire) {

var state = desire('game.state')
var theme = desire('game.theme')

var metrics = { }

metrics.visibleRange = function(callback) {
  var start = state.position
  var beats = notesAreaHeight() / unitHeight()
  var end   = start + beats
  return callback(start, end)
}

metrics.noteY = function(position, entity) {
  var delta = (position - state.position)
  return theme.notes.bottom - unitHeight() * delta
}

return metrics

function notesAreaHeight() {
  return theme.notes.bottom - theme.notes.top
}

function unitHeight() {
  return state.speed * theme.notes.barHeight / 4 * currentSpeed()
}

function currentSpeed() {
  return 1
}

  }

})
