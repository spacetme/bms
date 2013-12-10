
define(function(require) {
  
  var enums = require('enums')
  var _ = require('lodash')

  return function(desire) {

var stage = desire('game.stage')
var state = desire('game.state')
var notes = desire('game.notechart').notes
var keysound = desire('game.keysound')

function bind() {

  var codes = [82, 83, 84, 32, 78, 69, 73]
  var down = {}

  stage.onkeypress = function(e) {
    e.preventDefault()
  }

  stage.onkeyup = function(e) {
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    down[column] = false
  }

  stage.onkeydown = function(e) {
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    if (down[column]) return
    down[column] = true
    var matching = enums.toArray(notes).filter(function(note) {
      return note.column == column
    })
    var closest = _.min(matching, function(note) {
      return Math.pow(note.beat - state.beat, 2)
    })
    var keysounds = keysound.get(closest)
    keysounds.each(function(k) {
      k.play('hit')
    })
    return false
  }

}

return { bind: bind }

  }

})
