
define(function(require) {
  
  var pixi = require('pixi')

  return function(desire) {

var Theme = desire('game.Theme')
var state = desire('game.state')
var theme = new Theme()

// == various aspects of notes: positions, colors, widths ==
var noteX = [12, 44, 76, 108, 144, 176, 208]
var noteWidth = [32, 32, 32, 36, 32, 32, 32]
var noteColor = getNoteColors()

function getNoteColors() {
  var a = 0xFFCCBB, b = 0xBBCCFF, c = 0xCCFFBB
  return [a, b, a, c, a, b, a]
}

theme.layer("Hit Highlight Background", function(layer) {
  var a = 0xCC6600, b = 0x0066CC, c = 0x66CC00
  var colors = [a, b, a, c, a, b, a]
  noteX.forEach(function(x, column) {
    var width = noteWidth[column]
    var graphics = new pixi.Graphics()
    graphics.beginFill(colors[column])
    graphics.drawRect(x, 0, width, 512)
    theme.bind(function() {
      graphics.alpha = state.buttons[column] ? 0.33 : 0
    })
    layer.addChild(graphics)
  })
})

var notesLayer
theme.layer("Notes Area", function(layer) {
  notesLayer = layer
})

// == the panel that overlaid the notes ==
theme.layer("Panel", function(layer) {
  var panel = new pixi.Graphics()
  panel.beginFill(0x8b8685)
  panel.drawRect(0, 512, 800, 600 - 512)
  panel.drawRect(0, 0, 12, 512)
  panel.drawRect(240, 0, 12, 512)
  layer.addChild(panel)
})

// == return the theme description ==
theme.info({
  notes: {
    bottom: 512,
    top: 0,
    barHeight: 384,
    container: notesLayer
  },
  note: {
    left: noteX,
    height: 12,
    create: function(number) {
      var graphics = new pixi.Graphics()
      graphics.setHeight = function(height) {
        graphics.clear()
        graphics.beginFill(noteColor[number])
        graphics.drawRect(0, -height - theme.note.height, noteWidth[number], theme.note.height + height)
        graphics.beginFill(0xFFFFFF)
        graphics.drawRect(0, -height - theme.note.height, noteWidth[number], theme.note.height / 4)
      }
      return graphics
    }
  }
})

return theme

  }

})
