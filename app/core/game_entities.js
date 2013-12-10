
define(function(require) {

  var Entities = require('./entities')
  
  return function(desire) {
    return new Entities(desire('game.notes'))
  }

})
