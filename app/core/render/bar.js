
define(function(require) {

  var ObjectPool = require('object_pool')
  var enums = require('enums')
  var itself = require('itself')
  var Changer = require('changer')
  var $id = require('object_id')

  return function(desire) {
    
var state = desire('game.state')
var theme = desire('game.theme')
var timeSignatures = desire('game.notechart').timeSignatures
var metrics = desire('game.metrics')

var container = theme.bars.container

function BarEntity() {

  var graphics = theme.bar.create()
  var added = false

  return {
    set: function(value) {
      if (!added) {
        container.addChild(graphics)
        added = true
      }
      graphics.position.y = value.y
    },
    deactivate: function() {
      if (added) {
        container.removeChild(graphics)
        added = false
      }
    }
  }

}

BarEntity.hashKey = function(data) {
  return data.id
}

var pool = new ObjectPool(BarEntity)

function render() {
  pool.begin()
  getVisibleBarLines().each(function(measure) {
    var beat = timeSignatures.measureToBeat(measure)
    var position = metrics.beatToPosition(beat)
    var y = metrics.noteY(position, null)
    pool.use({ id: measure, y: y })
  })
  pool.commit()
}

function getVisibleBarLines() {
  var begin = Math.ceil(timeSignatures.beatToMeasure(state.beat))
  return enums.make(function(callback) {
    return metrics.visibleRange(function(start, end) {
      for (var i = begin;; i ++) {
        var beat = timeSignatures.measureToBeat(i)
        var position = metrics.beatToPosition(beat)
        if (position > end) return
        if (callback(i) === false) return false
      }
    })
  })
}

return { render: render }
    
  }
  
})
