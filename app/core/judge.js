
define(function(require) {

  var enums = require('enums')
  
  return function(desire) {

var timing = desire('game.notechart').timing
var playableNotes = desire('game.notes.playable')
var judgment = desire('game.judgment')
var hook = desire('game.hook')

function Judge(column) {
  
  var judge = { }
  var index = 0
  var items = judge._items = enums.toArray(enums.filter(playableNotes, selectColumn))
  var currentNote = null

  judge.update = function() {
    while (items[index] && judgment.judge(items[index]) == 'miss') {
      judgment.emit('miss')
      index += 1
    }
  }

  judge.down = function() {
    if (!items[index]) {
      judgment.blank(column)
      return
    }
    var result = judgment.judge(items[index])
    if (typeof result == 'number') {
      currentNote = items[index]
      judgment.emit(result, items[index], 'down')
      index += 1
    } else if (result == null) {
      judgment.blank(column)
    }
  }

  judge.up = function() {
    if (!currentNote) return
    var note = currentNote
    var result = judgment.judgeRelease(note)
    currentNote = null
    if (result != null) {
      judgment.emit(result, note, 'up')
    }
  }

  return judge

  function selectColumn(note) {
    return note.column == column
  }

}

return Judge

  }

})
