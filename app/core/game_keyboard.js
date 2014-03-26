
define(function(require) {
  
  var enums = require('enums')
  var _ = require('lodash')

  return function(desire) {

var stage = desire('game.stage')
var state = desire('game.state')
var speed = desire('game.speed')
var hook = desire('game.hook')
var notechart = desire('game.notechart')

function getKeymap() {

  if (notechart.columns == 6) {
    return keymap('SDFJKLQWEUIO', 6)
  } else if (notechart.columns == 7) {
    return keymap('SDF JKLQWE UIO', 7)
  }

  function keymap(str, mod) {
    var keys = { }
    for (var i = 0; i < str.length; i ++) {
      keys[str.charCodeAt(i)] = i % mod
    }
    return keys
  }
  
}

function bind() {

  var codes = getKeymap()
  var down = {}
  var columns = notechart.columns

  stage.onkeypress = function(e) {
    e.preventDefault()
  }

  stage.onkeyup = function(e) {
    e.preventDefault()
    var column = codes[e.keyCode]
    if (column == null) return
    state.release(column)
  }

  stage.onkeydown = function(e) {
    e.preventDefault()
    if (e.keyCode == 38) return speed.increase()
    if (e.keyCode == 40) return speed.decrease()
    var column = codes[e.keyCode]
    if (column == null) return
    state.press(column)
  }

}

return { bind: bind }

  }

})
