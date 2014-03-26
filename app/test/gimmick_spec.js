
define(function(require) {

  var Gimmick = require('gimmick')
  var expect = require('chai').expect

  return function() {

/**
 * We used to use a .zip file, but it does not work on iOS.
 */
describe('Gimmick', function() {

  it('should compute the position for beat', function() {
    var g = new Gimmick()
    g.apply(function() {
      g.scroll(1, 0.5)
    })
    expect(g.beatToPosition(2)).to.equal(1.5)
  })

  it('should compute the zoom level', function() {
    var g = new Gimmick()
    g.apply(function() {
      g.zoom(1, 0.5)
      g.zoom(5, 4.5)
    })
    expect(g.getZoom(3)).to.equal(2.5)
  })

})

  }

})
