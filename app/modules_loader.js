
define(function(require) {

  var when = require('when')

  return function loadPluginModules(plugins, suffix) {

    var total = plugins.length
    var loaded = 0

    return when.promise(function(resolve, reject, notify) {

      setTimeout(function() {
        notify({ loaded: loaded, total: total })
      }, 0)

      when.map(plugins, function(name) {
        return loadModule(name).then(function(module) {
          loaded += 1
          notify({ loaded: loaded, total: total, name: name })
          module.name = name
          return module
        })
      }).then(resolve, reject, notify)

    })

    function loadModule(name) {
      return when.promise(function(resolve, reject) {
        require([name + '/' + suffix], resolve, reject)
      })
    }


  }
  
})

