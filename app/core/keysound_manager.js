
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
var instances = { }

manager.autoplay = function() {
  while (autoplays[0] && state.beat >= autoplays[0].beat) {
    var note = autoplays.shift()
    var keysound = manager.get(note)
    if (keysound) keysound.play('auto')
  }
}

manager.blank = function(column) {
  var matching = enums.toArray(enums.filter(playables, function(note) {
    return note.column == column
  }))
  var closest = _.min(matching, function(note) {
    return Math.pow(note.beat - state.beat, 2)
  })
  var keysound
  if (closest) keysound = manager.get(closest)
  if (keysound) keysound.play('blank')
}

manager.hit = function(note) {
  var keysound = manager.get(note)
  if (keysound) {
    var instance = keysound.play('hit')
    if (note.finish) {
      instances[$id(note)] = instance
    }
  }
}

manager.release = function(note) {
  delete instances[$id(note)]
}

manager.break = function(note) {
  var instance = instances[$id(note)]
  if (instance) {
    instance.stop()
  }
}

// Must be called in time ordering!!
manager.addAutoplay = function(note) {
  autoplays.push(note)
}

return manager

  }

})
