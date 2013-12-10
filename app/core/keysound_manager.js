
define(function(require) {

  var $id = require('object_id')
  
  return function(desire) {

var manager = { }
var map = { }

manager.set = function(note, keysound) {
  map[$id(note)] = keysound
}

manager.get = function(note) {
  return map[$id(note)]
}

// === TODO factor this out

var state = desire('game.state')
var autoplays = [ ]

manager.autoplay = function() {
  while (autoplays[0] && state.beat >= autoplays[0].beat) {
    var note = autoplays.shift()
    var keysounds = manager.get(note)
    if (keysounds) keysounds.each(function(keysound) {
      keysound.play('auto')
    })
  }
}

// Must be called in time ordering!!
manager.addAutoplay = function(note) {
  autoplays.push(note)
}

return manager

  }

})
