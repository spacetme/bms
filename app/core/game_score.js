
define(function(require) {
  
  return function(desire) {

function ScoreTracker() {
  var tracker = { }
  tracker.judge = 0
  tracker.combo = 0
  tracker.add = function(judgment, combo) {
    var multiplier = 0
    if (judgment === 0) {
      tracker.judge += 3
      multiplier = 3
    } else if (judgment === 1) {
      tracker.judge += 2
      multiplier = 1
    }
    tracker.combo += Math.min(combo * multiplier, 300)
  }
  return tracker
}

var notes = desire('game.notes.playable')
var max = new ScoreTracker()
var score = new ScoreTracker()

loadMax()

score.get = function() {
  var accuracy = 500000
  var combo    =  55555
  return Math.floor(accuracy * score.judge / max.judge) +
    Math.floor(combo * score.combo / max.combo)
}

return score

function loadMax() {
  var combo = 0
  notes.each(function(note) {
    max.add(0, ++combo)
    if (note.finish) max.add(0, ++combo)
  })
}

  }

})
