
define(function(require) {

  var BMS = require('bms')

  return function bms() {
    var data = BMS.parse([].slice.call(arguments).join('\n'))
    return data
  }
  
})
