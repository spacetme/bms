
define(function(require) {

  var when = require('when')
  var zip = require('zip')
  var guard = require('when/guard')

  return function zipPreloader() {

    var preloader = { }

    /**
     * Loads a ZIP file and monkey-patches XHR to load from it.
     */
    preloader.load = function(path, prefix) {
      return when.promise(function loadDataUsingXHR2(resolve, reject, notify) {
        notify({ stage: 'zip file' })
        var xh = new XMLHttpRequest()
        xh.open('GET', path, true)
        xh.responseType = 'blob'
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
      }).then(function createZipReader(blob) {
        var entries = [ ]
        return when.promise(function(resolve, reject, notify) {
          zip.createReader(new zip.BlobReader(blob), resolve, reject)
        })
      }).then(function getEntries(reader) {
        var readEntry = guard(guard.n(1), function(entry) {
          return when.promise(function(resolve, reject, notify) {
            notify({ progress: entry._progress })
            entry.getData(new zip.BlobWriter(), function(blob) {
              resolve(blob)
            })
          }).then(function(blob) {
              return { filename: entry.filename, url: URL.createObjectURL(blob) }
            })
        })
        return when.promise(function(resolve, reject, notify) {
          notify({ stage: 'zip contents' })
          reader.getEntries(resolve)
        }).then(function processEntries(entries) {
          entries.forEach(function processEntry(entry, index) {
            entry._progress = index / entries.length
          })
          return when.map(entries, readEntry)
        }).finally(function close() {
          return when.promise(function(resolve, reject) {
            reader.close(function() {
              resolve()
            })
          })
        })
      })
      .then(function createMap(result) {
        var map = { }
        result.forEach(function(entry) {
          var filename = entry.filename.split('/').map(encodeURIComponent).join('/')
          map[prefix + '/' + filename] = entry.url
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
