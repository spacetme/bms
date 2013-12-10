
define(function(require) {
  
  var pixi = require('pixi')

  return function(desire) {

var stage = desire('game.stage')

var notes = new pixi.DisplayObjectContainer()
stage.addChild(notes)

var panel = new pixi.Graphics()
panel.beginFill(0x8b8685)
panel.drawRect(0, 512, 800, 600 - 512)
panel.drawRect(0, 0, 12, 512)
panel.drawRect(240, 0, 12, 512)

var noteWidth = [32, 32, 32, 36, 32, 32, 32]
var noteColor = (function() {
      var a = 0xFFCCBB, b = 0xBBCCFF, c = 0xCCFFBB
      return [a, b, a, c, a, b, a]
    }())
stage.addChild(panel)

var theme = {
  notes: {
    bottom: 512,
    top: 0,
    barHeight: 384,
    container: notes
  },
  note: {
    left: [12, 44, 76, 108, 144, 176, 208],
    height: 12,
    create: function(number) {
      var graphics = new pixi.Graphics()
      graphics.beginFill(noteColor[number])
      graphics.drawRect(0, 0, noteWidth[number], theme.note.height)
      graphics.beginFill(0xFFFFFF)
      graphics.drawRect(0, 0, noteWidth[number], theme.note.height / 4)
      return graphics
    }
  }
}

return theme

  }

})
