
define(function(require) {
  
  return function(desire) {
    
var judgment = { }
var state = desire('game.state')
var timingWindow = desire('game.judgment.timing_window')
var hook = desire('game.hook')

function judge(time, before, after) {
  var now = state.time
  var delta = Math.abs(time - now)
  for (var i = 0; i < timingWindow.length; i ++) {
    if (delta < timingWindow[i]) return i
  }
  return (now < time) ? before : after
}

judgment.judge = function(note) {
  return judge(note.time, undefined, 'miss')
}

judgment.judgeRelease = function(note) {
  if (!note.finishTime) return undefined
  return judge(note.finishTime, 'miss', 'miss')
}

judgment.blank = function(column) {
  hook('game.judgment.blank', { column: column })
}

judgment.emit = function(result, note, type) {
  hook('game.judgment', { note: note, result: result })
  if (typeof result == 'number' && type == 'down') {
    hook('game.judgment.hit', { note: note, result: result })
  } else if (type == 'up') {
    hook('game.judgment.release', { note: note, result: result })
  }
}

return judgment

  }

})
