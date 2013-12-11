
define(function(require) {
  
  var itself = require('itself')
  var pixi = require('pixi')
  var _ = require('lodash')

  return function(desire) {

var stage = desire('game.stage')

return function Theme() {

  var theme = { }
  var bindings = [ ]

  augmentLayer(theme, stage)

  /**
   * Set the information of a theme.
   */
  theme.info = function(object) {
    _.assign(theme, object)
  }

  /**
   * Set a function to be run on each game update.
   */
  theme.bind = function(callback) {
    bindings.push(callback)
  }

  /**
   * Calls the binded update functions.
   */
  theme.update = function() {
    bindings.forEach(itself('()'))
  }

  return theme

  /**
   * Augment layer-related functions into passed object.
   */
  function augmentLayer(object, stage) {
    object.layer = function(name, callback) {
      var container = new pixi.DisplayObjectContainer()
      stage.addChild(container)
      augmentLayer(container, container)
      if (typeof callback == 'function') {
        callback(container)
      }
      return container
    }
  }

}

  }

})
