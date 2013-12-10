
/*global mocha*/
define(function(require) {

  var App = require('app')

  var app = new App()
  app.plug(require('./core/index'))

  if (document.getElementById('test-app')) {
    require('./test/index')()
    mocha.run()
  } else {
    app.hook('main')
  }

})

