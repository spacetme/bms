
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
      play: function() {
        createjs.Sound.play(id)
      }
    }
  }

  notechart.notes.each(function(note) {
    keysoundManager.set(note, [ keysound(note.value) ])
    if (note.column < 0) {
      keysoundManager.addAutoplay(note)
    }
  })

/*
  var left  = new AudioWrapper(audios[1])
  var right = new AudioWrapper(audios[2])
  var leftTrack  = new SoundTrack(left)
  var rightTrack = new SoundTrack(right)

  leftTrack.apply(function() {
    rightTrack.apply(function() {

      notechart.notes.each(function(note) {
        var keysounds = [ ]
        var second = notechart.timing.beatToSecond(note.beat)
        if (note.value == '02') {
          keysounds.push(leftTrack.slice(second))
        }
        if (note.value == '04') {
          keysounds.push(rightTrack.slice(second))
        }
        keysoundManager.set(note, keysounds)
      })

    })
  })
*/

}

return { load: load }
    
  }
  
})
