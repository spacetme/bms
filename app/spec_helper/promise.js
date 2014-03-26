
define(function(require) {

  var when = require('when')

  return {

    resolves: function(fn) {
      return function(done) {
        when.try(fn).then(function() {
          done()
        }, function(e) {
          done(e)
        })
      }
    },

    rejects: function(fn) {
      return function(done) {
        when.try(fn).then(function() {
          done(new Error('A promise should be rejected!'))
        }, function() {
          done()
        })
      }
    }

  }
  
})

