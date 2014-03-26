
define(function(require) {

  var _ = require('lodash')

  return function Hook() {

    var hook = {}
    var actions = []

    function on(callback, priority) {
      var item = { order: priority || Infinity, do: callback }
      actions.splice(_.sortedIndex(actions, item, 'order'), 0, item)
    }

    function fire() {
      for (var i = 0; i < actions.length; i ++) {
        actions[i].do.apply(null, arguments)
      }
    }

    hook.do = on
    hook.fire = fire

    return hook

  }

})
