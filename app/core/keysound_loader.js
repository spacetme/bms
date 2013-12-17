
define(function(require) {

  var createjs = require('createjs')

  return function(desire) {

var notechart = desire('game.notechart')
var keysoundManager = desire('game.keysound')

function load() {

  var pool = { }

  function keysound(id) {
    if (pool[id]) return pool[id]
    pool[id] = createKeysound(id)
    return pool[id]
  }

  function createKeysound(id) {
    return {
      play: function(type) {
        var instance = createjs.Sound.play(id)
        if (type == 'auto') instance.volume = 0.8
        return instance
      }
    }
  }

  notechart.notes.each(function(note) {
    keysoundManager.set(note, keysound(note.value))
    if (note.column < 0) {
      keysoundManager.addAutoplay(note)
    }
  })

}

return { load: load }
    
  }
  
})
