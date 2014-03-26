
define(function(require) {

  var Desire = require('desire')

  return function ContextFactory() {

    var factory = { }
    var plugins = [ ]

    factory.use = function(plugin) {
      plugins.push(plugin)
      return this
    }

    factory.plugins = plugins

    factory.create = function(parentContext) {

      var context = { plugins: plugins.slice() }
      var desire = new Desire(parentContext && parentContext.get)

      desire.register({ context: Desire.value(context) })

      context.get = function(name) {
        return desire(name)
      }

      context.run = function(main) {
        desire(main).main()
      }

      registerPlugins()
      initializePlugins()

      function registerPlugins() {
        context.plugins.forEach(registerPlugin)
      }

      function registerPlugin(plugin) {
        if (plugin.components) {
          desire.register(plugin.components)
        }
      }

      function initializePlugins() {
        context.plugins.forEach(initializePlugin)
      }

      function initializePlugin(plugin) {
        if (typeof plugin.initialize == 'function') plugin.initialize(context.get)
      }

      return context

    }

    return factory

  }

})
