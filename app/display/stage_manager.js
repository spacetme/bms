
define(function(require) {

  var mixin = require('mixin')

  return mixin(function StageManager(object) {

    var stack = []

    object.currentStage = null

    object.pushStage = function(stage) {
      stack.push(stage)
      update()
    }

    object.popStage = function() {
      stack.pop()
      update()
    }
    
    object.replaceStage = function(stage) {
      if (stack.length === 0) {
        stack[0] = stage
      } else {
        stack[stack.length - 1] = stage
      }
      update()
    }

    object.forward = function(name, message) {
      var current = object.currentStage
      return current && current[name] && current[name](message)
    }

    function update() {
      object.currentStage = stack[stack.length - 1]
    }

  })

})
