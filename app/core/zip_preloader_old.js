
define(function(require) {

  var when = require('when')
  var zip = require('zip')
  var guard = require('when/guard')

  return function zipPreloader() {

    var preloader = { }

    /**
     * Loads a ZIP file and monkey-patches XHR to load from it.
     */
    preloader.load = function(path, prefix, contentType) {

      function xhr(url, type, responseType) {
        return when.promise(function loadUsingXHR2(resolve, reject, notify) {
          notify({ stage: type})
          var xh = new XMLHttpRequest()
          xh.open('GET', url, true)
          xh.responseType = responseType
          xh.onprogress = function(e) {
            if (e.lengthComputable) {
              notify({ progress: e.loaded / e.total })
            }
          }
          xh.onload = function(event) {
            if (xh.status == 200) {
              resolve(xh.response)
            } else {
              reject(new Error('HTTP ' + xh.statusCode))
            }
          }
          xh.onerror = function(event) {
            reject(event)
          }
          xh.send(null)
        })
      }

      return xhr(path, 'metadata file', 'text')
        .then(JSON.parse)
        .then(function(metadata) {
          var pak = path.replace(/[^\/]*$/, '/') + metadata.pak
          return xhr(pak, 'sample pack', 'blob')
            .then(function(blob) {
              return metadata.files.map(function(file) {
                var URL = (window.URL || window.webkitURL)
                var slice = blob.slice(file.start, file.end, contentType)
                var url = URL.createObjectURL(slice)
                return {
                  filename: file.file,
                  url: url
                }
              })
            })
        })
        .then(function createMap(result) {
          var map = { }
          result.forEach(function(entry) {
            if (entry.url) {
              map[prefix + '/' + encodeURIComponent(entry.filename)] = entry.url
            }
          })
          return map
        }).then(function monkeypatchXHR(map) {
          var xhr = XMLHttpRequest.prototype
          override(xhr, 'open', function(original) {
            return function(method, url, async) {
              if (url in map) {
                return original.call(this, method, map[url], async)
              } else {
                return original.apply(this, arguments)
              }
            }
          })
        })
    }

    return preloader

  }()

  function override(object, methodName, callback) {
    object[methodName] = callback(object[methodName])
  }
  
})
