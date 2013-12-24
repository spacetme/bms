
define(function(require) {

  var Desire = require('desire')
  var _ = require('lodash')

  var components = {
    'game.stage': require('./game_stage'),
    'game.timer': require('./game_timer'),
    'game.state': require('./game_state'),
    'game.metrics': require('./game_metrics'),
    'game.renderer': require('./game_renderer'),
    'game.render.bar': require('./render/bar'),
    'game.render.notes': require('./render/notes'),
    'game.Theme': require('./game_theme_class'),
    'game.theme': require('./game_theme'),
    'game.keyboard': require('./game_keyboard'),
    'game.keysound': require('./keysound_manager'),
    'game.load.keysound': require('./keysound_loader'),
    'game.entities': require('./entities'),
    'game.judges': require('./judges'),
    'game.Judge': require('./judge'),
    'game.judgment': require('./judgment'),
    'game.score': require('./game_score'),
    'game.judgment.timing_window': Desire.value([0.07, 0.12, 0.15])
  }

  _.assign(components, require('./game_notes'))

  return function(desire) {

    return function Game(options) {

var game = { }
var hook = desire('hook')
var display = desire('display')

game.desire = new Desire(desire)
game.desire.register(components)
game.desire.register({
  'game': Desire.value(game),
  'game.options': Desire.value(options),
  'game.notechart': Desire.value(options.notechart),
  'game.hook': Desire.value(hook.derive(game))
})

game.start = function() {

  var timer = game.desire('game.timer')
  timer.bindTimer()

  game.desire('game.renderer').start(game)
  game.desire('game.load.keysound').load()
  game.desire('game.keyboard').bind()
  game.desire('game.hook')('game.start')

}

return game

    }

  }

})
