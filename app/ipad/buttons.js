
define(function(require) {
  
  return function(desire) {

var notechart = desire('game.notechart')
var state = desire('game.state')
var columns = notechart.columns
var keys = document.createElement('div')
document.body.appendChild(keys)

var buttons = [ ]

for (var i = 0; i < columns; i ++) {
  buttons.push(createDiv(i, keys))
}

return { update: update }

function update() {
}

function createDiv(i, container) {
  var div = document.createElement('div')
  div.className = 'touch-button touch-button-' + i
  var inner = document.createElement('div')
  div.appendChild(inner)
  var left = Math.round(100 * i / columns)
  var right = Math.round(100 * (1 + i) / columns)
  div.style.left = left + '%'
  div.style.width = (right - left) + '%'
  container.appendChild(div)
  return inner
}

  }

})
