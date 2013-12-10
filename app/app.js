
define(function(require) {

  var Desire = require('desire')
  var Hooks = require('hooks')
  var _ = require('lodash')
  var when = require('when')
  
  return function App() {

    var desire = new Desire()
    var hooks = new Hooks()
    var app = { desire: desire }

    function plug(plugin) {
      desire.register(plugin.components)
      _.each(plugin.hooks, hooks.register)
    }

    function hook(name, value, context) {
      return hooks.run(name, value, context || app)
    }

    app.desire = desire
    app.plug = plug
    app.hook = hook

    desire.register({ hook: Desire.value(hook) })
    desire.register({ hooks: Desire.value(hooks) })

    return app

  }

})
