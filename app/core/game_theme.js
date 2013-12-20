
define(function(require) {
  
  var pixi = require('pixi')
  var Changer = require('changer')

  return function(desire) {

var Theme = desire('game.Theme')
var state = desire('game.state')
var timer = desire('game.timer')
var theme = new Theme()

// == various aspects of notes: positions, colors, widths ==
var noteX = []
var noteWidth = [32, 32, 32, 36, 32, 32, 32]
var noteColor = getNoteColors()

var totalWidth = noteWidth.reduce(function(a, b) { return a + b }, 0)
noteWidth.reduce(function(a, b) {
  noteX.push(a)
  return a + b
}, (800 - totalWidth) / 2)

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

// == display combo below ==
theme.layer("Combo Info", function(layer) {
  
  layer.position.x = noteX[3] + noteWidth[3] / 2
  layer.position.y = 160

  var combo
  var setCombo = new Changer(function(value) {
    if (combo) layer.removeChild(combo)
    combo = new pixi.Text("" + value, { font: 'bold 96px Helvetica', fill: '#8b8685' })
    combo.position.x = -combo.width / 2
    layer.addChild(combo)
  })

  theme.bind(function() {
    if (state.judgment) {
      var delta = timer.time - state.judgment.time
      var value = state.judgment ? state.judgment.combo : 0
      layer.visible = delta < 0.75 && value > 0
      layer.position.y = 160 - Math.exp(delta * -10) * 10
      if (layer.visible) {
        setCombo(value)
      }
    } else {
      layer.visible = false
    }
  })

})

var barsLayer
theme.layer("Time Signature Layer", function(layer) {
  barsLayer = layer
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
  panel.drawRect(noteX[0] + totalWidth, 0, 12, 512)
  panel.drawRect(noteX[0] - 12, 0, 12, 512)
  layer.addChild(panel)
})

theme.layer("Judgment Info", function(layer) {

  layer.position.x = noteX[3] + noteWidth[3] / 2
  layer.position.y = 300

  var font = '50px Krungthep'
  var cool = text("เยี่ยม", { font: font, fill: '#fff' })
  var good = text("ดี", { font: font, fill: '#9cf' })
  var badd = text("แย่", { font: font, fill: '#c9c' })
  var miss = text("กาก", { font: font, fill: '#aaa' })
  var display = new Changer(displayObject, null)

  function displayObject(newObject, oldObject) {
    if (oldObject) oldObject.visible = false
    if (newObject) newObject.visible = true
  }

  theme.bind(function() {
    if (state.judgment) {
      var delta = timer.time - state.judgment.time
      layer.visible = delta < 0.75
      layer.position.y = 300 - Math.exp(delta * -10) * 10
      display(getThing())
    } else {
      display(null)
    }
  })

  function getThing() {
    if (state.judgment.result === 0) return cool
    if (state.judgment.result === 1) return good
    if (state.judgment.result === 2) return badd
    if (state.judgment.result == 'miss') return miss
  }
  
  function text(string, options) {
    var obj = new pixi.Text(string, options)
    obj.position.x -= obj.width / 2
    obj.visible = false
    layer.addChild(obj)
    return obj
  }

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
  },
  bars: {
    container: barsLayer
  },
  bar: {
    create: function() {
      var graphics = new pixi.Graphics()
      graphics.beginFill(0x9b9695)
      graphics.drawRect(noteX[0], -1, totalWidth, 1)
      graphics.beginFill(0x8b8685)
      graphics.drawRect(noteX[0], -2, totalWidth, 1)
      return graphics
    }
  }
})

return theme

  }

})
