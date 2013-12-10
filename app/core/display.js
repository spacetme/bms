
define(function(require) {
  
  var pixi = require('pixi')
  var StageManager = require('./stage_manager')

  var _ = require('lodash')
  var partial = _.partial

  return function Display(desire) {

    var element = document.createElement('div')
    element.className = 'stage'

    var renderer = pixi.autoDetectRenderer(800, 600)
    element.appendChild(renderer.view)

    var display = StageManager.mix({ })

    display.renderTo = function(container) {
      container.appendChild(element)
      window.addEventListener('keydown',  partial(display.forward, 'onkeydown'),  false)
      window.addEventListener('keypress', partial(display.forward, 'onkeypress'), false)
      window.addEventListener('keyup',    partial(display.forward, 'onkeyup'),    false)
    }

    display.render = function() {
      renderer.render(display.currentStage)
    }

    return display

  }

})
