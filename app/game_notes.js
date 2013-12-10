
define(function(require) {

  var enums = require('enums')
  var bsearch = require('bsearch')
  var $id = require('object_id')
  
  /**
   * A data structure representing the notes to display
   */
  return function GameNotes(data) {

    var notes = { }

    var entities = [ ]
    var longEntities = [ ]

    data.each(function(note) {

      if (note.column < 0) return
      
      var position = beatToPosition(note.beat)
      var entity = { position: position, note: note }

      entities.push(entity)

      if (note.finish != null) {
        entity.finish = beatToPosition(note.finish)
        longEntities.push(entity)
      }
      
    })

    entities.sort(function(a, b) {
      return a.position - b.position
    })

    longEntities.sort(function(a, b) {
      return a.finish - b.finish
    })

    notes.range = function(start, finish) {
      return enums.make(function each(callback) {
        var use = user(callback)
        if (false === rangeShort(start, finish, use)) return false
        if (false === rangeLong(start, finish, use)) return false
      })
    }

    return notes

    function beatToPosition(beat) {
      return beat
    }

    function rangeShort(start, finish, use) {
      var first = bsearch(entities,
            function(entity) { return entity.position >= start })
      var last = bsearch.lastIndex(entities,
            function(entity) { return entity.position < finish })
      if (first == null) return
      for (var i = first; i <= last; i ++) {
        var entity = entities[i]
        if (use(entity) === false) return false
      }
    }

    function rangeLong(start, finish, use) {
      var first = bsearch(longEntities,
            function(entity) { return start < entity.finish })
      if (first == null) return
      for (var i = first; i < longEntities.length; i ++) {
        var entity = longEntities[i]
        if (entity.position > finish) continue
        if (use(entity) === false) return false
      }
    }

    function user(callback) {
      var used = { }
      return function(object) {
        var id = $id(object)
        if (!used[id]) {
          used[id] = true
          return callback(object)
        }
      }
    }
    
  }


})









