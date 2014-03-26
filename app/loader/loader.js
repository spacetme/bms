
define(function(require) {

  return function(desire) {
    
    var notesLoader = desire('notes_loader')

    return { load: load }

    function load(base, filename) {

      var notechart
      var keysounds

      return notesLoader.load(base, filename)
        .tap(function(result) {
          notechart = result
          console.log(notechart)
        })

    }

  }

})
