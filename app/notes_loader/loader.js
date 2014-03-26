
define(function(require) {

var when = require('when')

  return function(desire) {

function load(base, filename) {

  var notechart
  var extname = filename.replace(/^.*(\.[^\.]+)$/i, '$1').toLowerCase()

  return when.try(types[extname] || types.default, base, filename)

}

var types = { }

types.default = function(base, filename) {
  throw new Error('No handler for this filetype!')
}

return { load: load, types: types }

  }

})
