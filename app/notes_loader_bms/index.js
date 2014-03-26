
define(function(require) {

  var BMS = require('bms')
  var io = require('io')
  var Notechart = require('notechart')

  var convert = require('./bms_converter').convert

  return {

    initialize: function(desire) {

      var notesLoader = desire('notes_loader')

      notesLoader.types['.bms'] =
      notesLoader.types['.bme'] =
      notesLoader.types['.bml'] =
      notesLoader.types['.bmx'] = function(base, filename) {
        return io.get(base + '/' + filename)
          .then(BMS.parse)
          .then(function(bms) {
            var notechart = new Notechart()
            convert(bms, notechart)
            return notechart
          })
      }

    }

  }
  
})
