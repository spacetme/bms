
define(function(require) {

  var Shou = require('shou')
  var config = require('config')

  var load = require('modules_loader')
  load(config.plugins, 'index').then(function(plugins) {

    var factory = Shou()
    plugins.forEach(factory.use)

    var app = factory.create()
    app.run('main')

  }, null, function(event) {

    console.log('Loaded ' + event.name + ' [' + event.loaded + '/' + event.total + ']')
    return event

  }).done()


})

