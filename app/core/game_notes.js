
define(function(require) {

  var enums = require('enums')

  function createComponentFactory(autoplay) {
    function filter(note) {
      return (note.channel < 0) == autoplay
    }
    return function(desire) {
      var notes = desire('game.notes')
      return enums.filter(notes, filter)
    }
  }

  return {
    autoplay: createComponentFactory(true),
    playable: createComponentFactory(false),
    main: function(desire) {
      return desire('game.notechart').notes
    }
  }

})
