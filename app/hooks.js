
define(function(require) {

  var _ = require('lodash')
  var its = require('itself')

  return function Hooks() {

    var hooks = {}
    var map = {}

    hooks.register = function(item) {
      var list = map[item.on] || (map[item.on] = [])
      list.splice(_.sortedIndex(list, item, 'order'), 0, item)
    }

    hooks.run = function(name, value, context) {
      var list = map[name]
      if (!list) return value
      for (var i = 0; i < list.length; i ++) {
        list[i].do.call(context, value)
      }
    }

    return hooks

  }

})
