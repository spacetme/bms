
define(function(require) {
  
  var pixi = require('pixi')
  var Changer = require('changer')

  return function(desire) {

var Theme = desire('game.Theme')
var state = desire('game.state')
var timer = desire('game.timer')
var ready = desire('game.ready')
var ComboNumber = require('./theme/combo')(desire)
var options = desire('game.options')
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

  var combo = new ComboNumber(layer)

  theme.bind(function() {
    if (state.judgment) {
      var delta = timer.time - state.judgment.time
      var value = state.judgment ? state.judgment.combo : 0
      layer.visible = delta < 0.75 && value > 0
      layer.position.y = 160 - Math.exp(delta * -10) * 10
      if (layer.visible) {
        combo.set(value)
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

// == score ==
theme.layer("Score", function(layer) {
  var style = { font: 'bold 24px Helvetica', fill: '#e9e8e7' }
  var score = new ComboNumber(layer, { style: style, digits: 6 })
  layer.position.y = 512 + 24
  layer.position.x = 400
  theme.bind(function() {
    var value = state.score.get()
    score.set(value)
    layer.visible = ready.status
  })
})

theme.layer("Space to Start", function(layer) {
  var style = { font: 'bold 24px Helvetica', fill: '#e9e8e7' }
  var style2 = { font: 'bold 24px Helvetica', fill: '#ffff00' }
  var text = new pixi.Text("Press SPACE to Start", style)
  var text2 = new pixi.Text("Press SPACE to Start", style2)
  layer.position.y = 512 + 24
  layer.position.x = 400
  layer.addChild(text)
  layer.addChild(text2)
  text.position.x -= Math.round(text.width / 2)
  text2.position.x = text.position.x
  theme.bind(function() {
    layer.visible = !ready.status
    text2.alpha = ready.highlight()
  })
})

if (options.tutorial) theme.layer("Tutorial", function(layer) {

  layer.position.x = noteX[3] + noteWidth[3] / 2
  layer.position.y = 150

  tutorial(0, 3, function(text) {
    text("Before we start the tutorial")
    text("Let's see if you can figure")
    text("it out by yourself!")
  })

  tutorial(19, 23, function(text) {
    text("BEAT☆MUSIC☆SEQUENCE")
    text("is an online rhythm game.")
    text("")
    text("You use your keyboard")
    text("to play this game.")
  })

  tutorial(23, 27, function(text) {
    text("As you've seen,")
    text("notes will fall down")
    text("from the top of the screen.")
    text("You have to hit")
    text("the corresponding key")
    text("when it reaches the bottom.")
  })

  tutorial(27, 33, function(text) {
    text("The next set of notes is coming.")
    text("When it comes, here are the keys")
    text("that you need to hit:")
    text("S, S, D, D, F, F,")
    text("Space, Space,")
    text("J, J, K, K, L, L, Space")
  })

  tutorial(33, 35, function(text) {
    text("They're Coming!!")
    text("...")
    text("...")
    text("GET READY!")
  })

  tutorial(43, 47, function(text) {
    text("Sometimes, more than one note")
    text("may fall down at the same time.")
    text("")
    text("That means you must hit")
    text("multiple keys at the same time.")
  })

  tutorial(47, 51, function(text) {
    text("They're coming again!!")
    text("Here are the keys to hit:")
    text("")
    text("FJ FJ FJ FJ DJ DJ FK FK")
  })

  tutorial(55, 59, function(text) {
    text("There are also long notes.")
    text("You need to press and hold")
    text("the key until the note is")
    text("finished...")
  })

  tutorial(67, 75, function(text) {
    text("That's all!")
    text("")
    text("Now you know")
    text("everythingyou need to know")
    text("to play this game!")
    text("")
    text("HAVE FUN!!")
  })

  function tutorial(start, end, callback) {

    var y = 0
    var index = 0

    callback(text)

    function text(string, options) {
      var begin = start + index * 0.25 + 0.01
      var obj = new pixi.Text(string, { font: '15px Arial', fill: 'white' })
      obj.position.x -= Math.round(obj.width / 2)
      obj.position.y = y
      y += 28
      index += 1
      obj.visible = false
      layer.addChild(obj)
      theme.bind(function() {
        var now = state.beat / 4
        if (begin <= now && now < end) {
          if (now <= begin + 0.25) {
            obj.alpha = (now - begin) / 0.25
          } else if (end - 0.25 <= now) {
            obj.alpha = (end - now) / 0.25
          } else {
            obj.alpha = 1
          }
          obj.visible = true
        } else {
          obj.visible = false
        }
      })
      return obj
    }

    
  }
  
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
