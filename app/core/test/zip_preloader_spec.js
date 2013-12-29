
define(function(require) {

  var preloader = require('../zip_preloader')
  var when = require('when')
  var expect = require('chai').expect

  return function() {

/**
 * We used to use a .zip file, but it does not work on iOS.
 */
describe('ZipPreloader', function() {
  it('should preload a pak file ready to be used by xhr', function(done) {

    preloader.load('test/txts.zip', 'lol', 'text/plain')
      .then(test('lol/a.txt', 'hello world'))
      .then(test('lol/b.txt', 'blah blah blah'))
      .then(test('lol/c.txt', 'do you want to build a snowman'))
      .then(function() { done() }, done)

    function test(path, expected) {
      return function() {
        return when.promise(function(resolve, reject) {
          var xh = new XMLHttpRequest()
          xh.open('GET', path, true)
          xh.onload = function() {
            resolve(xh.responseText)
          }
          xh.send(null)
        }).then(function(text) {
          expect(text.trim()).to.equal(expected)
        })
      }
    }
    
  })
  it('should return failure in case of failure', function(done) {

    preloader.load('test/wtf.zip', 'lol')
      .then(function() {
        done(new Error('should fail'))
      },
      function() { done() })

  })
})

  }

})
