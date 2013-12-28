
define(function(require) {

  var bsearch = require('bsearch')
  
  return function(desire) {

var state = desire('game.state')
var speed = desire('game.speed')
var theme = desire('game.theme')
var gimmick = desire('game.gimmick')

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

metrics.beatToPosition = function(beat) {
  return gimmick.beatToPosition(beat)
}

return metrics

function notesAreaHeight() {
  return theme.notes.bottom - theme.notes.top
}

function unitHeight() {
  return speed.current * theme.notes.barHeight / 4 * currentSpeed()
}

function currentSpeed() {
  return gimmick.getZoom(state.beat)
}

  }

})
