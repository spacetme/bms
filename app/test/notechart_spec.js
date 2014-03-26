
define(function(require) {

  var Notechart = require('notechart')

  return function() {

describe('notechart', function() {

  it('should contain timeSignatures', function() {
    expect(new Notechart().timeSignatures).to.be.ok
  })
  it('should contain timing', function() {
    expect(new Notechart().timing).to.be.ok
  })
  it('should contain gimmick', function() {
    expect(new Notechart().gimmick).to.be.ok
  })
  it('should contain noteData', function() {
    expect(new Notechart().notes.each).to.be.ok
  })

})

  }

})
