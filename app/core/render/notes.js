
define(function(require) {

  var ObjectPool = require('object_pool')
  var enums = require('enums')
  var itself = require('itself')
  var Changer = require('changer')
  var $id = require('object_id')

  return function(desire) {
    
var state = desire('game.state')
var theme = desire('game.theme')
var gameEntities = desire('game.entities')
var metrics = desire('game.metrics')

var pools = [ ]
var columns = [ 0, 1, 2, 3, 4, 5, 6 ]

var container = theme.notes.container

columns.forEach(function(number) {

  var x = theme.note.left[number]

  function NoteEntity() {

    var graphics = theme.note.create(number)
    var added = false

    var setHeight = new Changer(function changeHeight(height) {
          graphics.setHeight(height)
        }, 0)

    return {
      set: function(value) {
        if (!added) {
          container.addChild(graphics)
          added = true
        }
        graphics.position.x = x
        graphics.position.y = value.y
        setHeight(value.height)
      },
      deactivate: function() {
        if (added) {
          container.removeChild(graphics)
          added = false
        }
      }
    }

  }

  NoteEntity.hashKey = function(data) {
    return data.id
  }

  var pool = new ObjectPool(NoteEntity)
  pools.push(pool)

})

function render() {
  var entities = getEntities()
  pools.each(itself('.begin()'))
  entities.each(function(entity) {
    var column = entity.note.column
    var y = metrics.noteY(entity.position, entity)
    var pool = pools[column]
    if (entity.finish) {
      var yy = metrics.noteY(entity.finish, entity)
      pool.use({ id: $id(entity), y: y, height: y - yy })
    } else {
      pool.use({ id: $id(entity), y: y, height: 0 })
    }
  })
  pools.each(itself('.commit()'))
}

function getEntities() {
  return metrics.visibleRange(function(start, end) {
    return gameEntities.range(start, end)
  })
}

return { render: render }
    
  }
  
})
