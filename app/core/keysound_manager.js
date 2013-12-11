
define(function(require) {

  var $id = require('object_id')
  var enums = require('enums')
  var _ = require('lodash')
  
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
var playables = desire('game.notes.playable')
var autoplays = [ ]

manager.autoplay = function() {
  while (autoplays[0] && state.beat >= autoplays[0].beat) {
    var note = autoplays.shift()
    var keysound = manager.get(note)
    if (keysound) keysound.play('auto')
  }
}

manager.hit = function(event) {
  var column = event.column
  var matching = enums.toArray(enums.filter(playables, function(note) {
    return note.column == column
  }))
  var closest = _.min(matching, function(note) {
    return Math.pow(note.beat - state.beat, 2)
  })
  var keysound = manager.get(closest)
  if (keysound) keysound.play('hit')
}

// Must be called in time ordering!!
manager.addAutoplay = function(note) {
  autoplays.push(note)
}

return manager

  }

})
