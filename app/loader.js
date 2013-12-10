
define(function(require) {

  var when = require('when')
  var BMS = require('bms')

  var createjs = require('createjs')

  var loader = {
    file: function file(path) {
      return when.promise(function(resolve, reject) {
        var xh = new XMLHttpRequest()
        xh.open('GET', path, true)
        xh.onload = function() {
          resolve(xh.responseText)
        }
        xh.send('')
      })
    },
    bms: function bms(path) {
      return loader.file(path).then(function(text) {
        return BMS.parse(text)
      })
    },
    audio: function audio(path, id) {
      return when.promise(function(resolve, reject) {
        createjs.Sound.addEventListener("fileload", function(event) {
          if (event.id != id) return
          resolve()
        })
        createjs.Sound.registerSound(path, id)
        /*
        var el = new Audio(path)
        document.body.appendChild(el)
        el.addEventListener('canplaythrough', function(e) {
          resolve(el)
        })
        el.addEventListener('error', function(e) {
          reject(e)
        })
        el.load()
        */
      })
    }
  }

  return loader
  
})

