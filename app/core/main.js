
define(function(require) {

  var LoadingStage = require('./loading_stage')
  var loader = require('loader')
  var when = require('when')
  var Notechart = require('notechart')
  var _ = require('lodash')
  var createjs = require('createjs')
  var pixi = require('pixi')

  var preloader = require('./zip_preloader')

  return function(desire) {

var display = desire('display')
var gameManager = desire('game_manager')
var Game = desire('Game')

/**
 * Checks if the browser support this audio type.
 * (createjs sound getCapability not working)
 */
function checkType(type) {
  // http://stackoverflow.com/questions/8469145/how-to-detect-html5-audio-mp3-support
  var a = document.createElement('audio')
  return !!(a.canPlayType && a.canPlayType(type).replace(/no/, ''))
}

function startGame(base, filename) {

  var bms
  var map

  when()
  .then(function() {
    display.replaceStage(new LoadingStage('the notechart', filename, base))
    display.render()
    return loadBMS()
  })
  .tap(function(arg) {
    bms = arg
  })
  .tap(function() {
    var keysounds = null
    var type = null
    var stage = null
    var mp3 = checkType('audio/mpeg;')
    var ogg = checkType('audio/ogg; codecs="vorbis"')
    if (mp3) {
      keysounds = 'mp3s.zip'
      type = 'audio/mpeg'
    } else if (ogg) {
      keysounds = 'oggs.zip'
      type = 'audio/ogg'
    }
    if (!keysounds) return
    if (!window.URL) return
    try { if (new Blob(['test']).size != 4) return } catch (e) { return }
    return preloader.load(base + '/' + keysounds, base, type)
      .then(
        null,
        function(e) { console.error('Cannot preload samples', e) },
        function(event) {
          if (event.stage) {
            stage = new LoadingStage(event.stage, keysounds, base)
            display.replaceStage(stage)
            display.render()
          } else if (stage && 'progress' in event) {
            stage.setProgress(event.progress)
            display.render()
          }
        })
  })
  .tap(function() {
    var headers = bms.headers
    var stage = new LoadingStage('keysounds', headers.title, headers.artist)
    display.replaceStage(stage)
    display.render()
    return loadKeysounds(stage)
  })
  .tap(function() {
    var notechart = new Notechart(bms)
    var game = new Game({
      notechart: notechart,
      tutorial: filename == 'ByMySide-TUTORIAL.bms'
    })
    game.start()
    display.replaceStage(game.desire('game.stage'))
    gameManager.currentGame = game
  })
  .done()

  function loadBMS() {
    return loader.bms(base + '/' + filename)
  }

  function loadKeysounds(stage) {

    return when.promise(function(resolve, reject) {

      var queue = new createjs.LoadQueue()
      queue.installPlugin(createjs.Sound)
      createjs.Sound.alternateExtensions = ["ogg"]

      queue.addEventListener("complete", resolve)
      queue.addEventListener("progress", function(event) {
        stage.setProgress(event.progress)
        display.render()
      })

      _.forOwn(bms.keysounds, function(value, key) {
        queue.loadFile({
          id: key,
          src: base + '/' + encodeURIComponent(value.replace(/\.(?:wav|mp3|ogg)$/i, '.mp3'))
        })
      })

    })

  }
  
}

function run() {

  display.renderTo(document.body)
  startGame(
    sessionStorage['music.path'] || 'music/default/sawasdee-new-year',
    sessionStorage['music.bms'] || 'sawasdee-new-year-normal.bms')

}

return { run: run }

  }

})
