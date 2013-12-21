define(function(require) {

  var guardModification = require('guard_modification')
  var Integrator = require('integrator')
  var Interpolator = require('interpolator')
  
  return function Gimmick() {
    
    var gimmick = { }

    var zoom = []
    var scroll = []

    var interpolateZoom
    var integrateScroll

    guardModification(gimmick, function(guard) {

      gimmick.scroll = function(beat, value) {
        scroll.push([beat, value])
      }

      gimmick.zoom = function(beat, value) {
        zoom.push([beat, value])
      }

      return function optimize() {
        interpolateZoom = new Interpolator(zoom)
        integrateScroll = new Integrator(scroll)
      }

    })

    gimmick.getZoom = function(beat) {
      return interpolateZoom(beat)
    }

    gimmick.beatToPosition = function(beat) {
      return integrateScroll(beat)
    }

    gimmick.apply(function() { })

    return gimmick

  }

})
