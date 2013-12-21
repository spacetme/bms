
define(function(require) {

  var enums = require('enums')

  function createComponentFactory(autoplay) {
    function filter(note) {
      return (note.column < 0) == autoplay
    }
    return function(desire) {
      var notes = desire('game.notes')
      return enums.filter(notes, filter)
    }
  }

  return {
    'game.notes.autoplay': createComponentFactory(true),
    'game.notes.playable': createComponentFactory(false),
    'game.notes': function(desire) {
      return desire('game.notechart').notes
    }
  }

})
