
define(function(require) {
  
  return function(desire) {

var hook = desire('hook')
var gameTimer = { }

gameTimer.time = 0

gameTimer.bindAudio = function(audio) {
  setInterval(function() {
    setTime(audio.currentTime)
  }, 1000 / 60)
}

gameTimer.bindTimer = function() {
  var start = new Date().getTime()
  setInterval(function() {
    var elapsed = (new Date().getTime() - start) / 1000
    setTime(elapsed)
  }, 1000 / 60)
}

return gameTimer

function setTime(time) {
  var oldTime = gameTimer.time
  if (time != oldTime) {
    var game = desire('game')
    gameTimer.time = time
    hook('game.time', { time: time, previous: oldTime, game: game })
  }
}

  }

})
