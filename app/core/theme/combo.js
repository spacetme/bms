
define(function(require) {

  var pixi = require('pixi')
  var Changer = require('changer')

  return function(desire) {

    return function ComboNumber(layer, options) {

      options = options || { }

      var elements = []
      var combo = { }
      var visible = [ ]

      init()

      var change = Changer(function(value) {
        if (value === '') return
        clear()
        var padding = 2
        var width = 0
        for (var i = 0; i < value.length; i ++) {
          var element = elements[i] && elements[i][value.charAt(i)]
          if (element) {
            visible.push(element)
            width += element.width + padding * 2
          }
        }
        var x = Math.round(-width / 2)
        for (i = 0; i < visible.length; i ++) {
          layer.addChild(visible[i])
          visible[i].position.x = x
          x += visible[i].width + padding * 2
        }
      }, '')

      combo.set = function(value) {
        change(value + '')
      }

      return combo

      function clear() {
        visible.forEach(function(object) {
          layer.removeChild(object)
        })
        visible.length = 0
      }

      function init() {
        var digits = options.digits || 4
        var style = options.style || { font: 'bold 96px Helvetica', fill: '#8b8685' }
        for (var i = 0; i < digits; i ++) {
          elements.push(makeDigit(style))
        }
      }

      function makeDigit(style) {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(number) {
          return new pixi.Text('' + number, style)
        })
      }

    }

  }

})
