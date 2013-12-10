
define(function(require) {
  
  var pixi = require('pixi')
  
  return function LoadingStage(what, titleText, subtitleText) {

    var stage = new pixi.Stage(0x000000)
    var bar   = new pixi.Graphics()

    var text  = new pixi.Text('Yo!! We are loading ' + what + '!', { fill: 'white' })
    text.position = new pixi.Point(20, 360)

    var title = new pixi.Text('' + titleText, { fill: 'white' })
    title.position = new pixi.Point(20, 20)

    var subtitle = new pixi.Text('' + subtitleText, { fill: '#8b8685' })
    subtitle.position = new pixi.Point(20, 60)

    stage.addChild(bar)
    stage.addChild(text)

    stage.addChild(title)
    stage.addChild(subtitle)

    stage.setProgress = function(progress) {
      bar.beginFill(0xCCCCCC)
      bar.drawRect(0, 400, 800, 80)
      bar.beginFill(0x000000)
      bar.drawRect(20, 420, 760 * progress, 40)
    }

    return stage

  }

})
