
define(function(require) {

  var guardModification = require('guard_modification')

  return function(desire) {

var timer = desire('game.timer')

function SoundTrack(audio) {

  var track = { }
  var slices = [ ]
  var sliceMap = { }

  var layers = new LayerManager()

  layers.fallback = function() {
    audio.stop()
  }

  guardModification(track, function(guard) {
    track.slice = guard(function(time) {
      var key = Math.round(time * 1000)
      if (sliceMap[key]) return sliceMap[key]
      var slice = sliceMap[key] = createSlice(time)
      slices.push(slice)
      return slice
    })
    return function() {
      slices.sort(function(a, b) {
        return a._time - b._time
      })
      for (var i = 0; i < slices.length; i ++) {
        slices[i]._length = (i + 1 < slices.length)
          ? slices[i + 1]._time - slices[i]._time : null
      }
    }
  })

  return track

  function createSlice(time) {

    var slice = { }

    slice._time = time

    slice.play = function(type) {
      if (type == 'auto') {
        playAuto()
      } else {
        playHit(type)
      }
    }

    return slice

    function playAuto() {

      var timeToStop = slice._time + slice._length
      if (timer.time >= timeToStop) return

      var stop = layers.background({ enter: enter })
      if (slice._length != null) {
        var delay = Math.round((timeToStop - timer.time) * 1000)
        setTimeout(stop, delay)
      }

      function enter() {
        audio.start(timer.time)
      }

    }

    function playHit(type) {

      var start = timer.time
      var stop = layers.add({ enter: enter })

      if (slice._length != null) {
        setTimeout(stop, Math.round(slice._length * 1000) + 100)
      }

      function enter() {
        //audio.start(slice._time + (timer.time - start))
        audio.start(timer.time)
      }

    }

  }

}


function LayerManager() {

  var layers = { }
  var stack = [ ]
  var background = null
  var currentLayer = null

  layers.background = function(layer) {
    background = layer
    update()
    return function() {
      if (background == layer) background = null
      update()
    }
  }

  layers.add = function(layer) {
    stack.push(layer)
    update()
    return function() {
      var index = stack.indexOf(layer)
      if (index > -1) stack.splice(index, 1)
      update()
    }
  }

  return layers

  function update() {
    var top = getTopLayer()
    if (top != currentLayer) {
      currentLayer = top
      if (currentLayer) {
        currentLayer.enter()
      } else if (layers.fallback) {
        layers.fallback()
      }
    }
  }

  function getTopLayer() {
    if (stack.length > 0) return stack[stack.length - 1]
    return background
  }
  
}

return SoundTrack
    
  }
  
})





