
define(function(require) {
  
  var enums = require('enums')
  var _ = require('lodash')

  return function(desire) {

var stage = desire('game.stage')
var hook = desire('game.hook')

function bind() {

  var codes = [82, 83, 84, 32, 78, 69, 73]
  var down = {}

  stage.onkeypress = function(e) {
    e.preventDefault()
  }

  stage.onkeyup = function(e) {
    e.preventDefault()
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    if (!down[column]) return
    down[column] = false
    hook('game.column.up', { column: column })
  }

  stage.onkeydown = function(e) {
    e.preventDefault()
    var column = codes.indexOf(e.keyCode)
    if (column == -1) return
    if (down[column]) return
    down[column] = true
    hook('game.column.down', { column: column })
  }

}

return { bind: bind }

  }

})
