
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
    return keymap('RSTNEI')
  } else if (notechart.columns == 7) {
    return keymap('RST NEI')
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

return { bind: bind }

  }

})
