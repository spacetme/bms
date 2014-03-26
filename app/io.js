
define(function(require) {

  var when = require('when')
  
  return {
    get: function file(path) {
      return when.promise(function(resolve, reject) {
        var xh = new XMLHttpRequest()
        xh.open('GET', path, true)
        xh.onload = function() {
          resolve(xh.responseText)
        }
        xh.send('')
      })
    }
  }

})
