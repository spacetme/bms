
define(function(require) {

  var GameNotes = require('game_notes')
  var Desire = require('desire')

  var components = {
    'game.stage': require('./game_stage'),
    'game.timer': require('./game_timer'),
    'game.state': require('./game_state'),
    'game.metrics': require('./game_metrics'),
    'game.renderer': require('./game_renderer'),
    'game.render.notes': require('./render/notes'),
    'game.theme': require('./game_theme'),
    'game.keyboard': require('./game_keyboard'),
    'game.keysound': require('./keysound_manager'),
    'game.load.keysound': require('./keysound_loader')
  }

  return function(desire) {

    return function Game(notechart) {

var game = { }
var hook = desire('hook')
var display = desire('display')

game.desire = new Desire(desire)
game.desire.register(components)
game.desire.register({
  'game': Desire.value(game),
  'game.notechart': Desire.value(notechart),
  'game.notes': Desire.value(new GameNotes(notechart.notes))
})

game.start = function() {

  var timer = game.desire('game.timer')
  timer.bindTimer()

  game.desire('game.renderer').start(game)
  game.desire('game.load.keysound').load()
  game.desire('game.keyboard').bind()

  hook('game.start', { game: game })

}

return game

    }

  }

})
