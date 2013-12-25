
define(function(require) {
  
  var enums = require('enums')
  var _ = require('lodash')

  return function(desire) {

var stage = desire('game.stage')
var state = desire('game.state')
var hook = desire('game.hook')
var notechart = desire('game.notechart')

function getKeymap() {

  if (notechart.columns == 6) {
    return keymap('SDFJKL')
  } else if (notechart.columns == 7) {
    return keymap('SDF JKL')
  }

  function keymap(str) {
    var keys = []
    for (var i = 0; i < str.length; i ++) {
      keys.push(str.charCodeAt(i))
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
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    state.release(column)
  }

  stage.onkeydown = function(e) {
    e.preventDefault()
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    state.press(column)
  }

}

return { bind: bind }

  }

})
