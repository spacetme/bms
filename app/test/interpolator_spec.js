
define(function(require) {

  var expect = require('chai').expect
  var Interpolator = require('interpolator')
  
  return function() {

describe('Interpolator', function() {

  it('should return just 1 when blank', function() {

var interpolate = new Interpolator([ ])

var data = [
  [0, 1],
  [0.5, 1],
  [1, 1],
  [1.5, 1],
  [2, 1],
  [2.5, 1],
  [3, 1],
  [4, 1],
  [1000, 1],
  [-1000, 1]
]

data.forEach(function(c) {
  expect(interpolate(c[0])).to.equal(c[1])
})

  })

  it('should interpolate points', function() {

var interpolate = new Interpolator([
  [0, 1],
  [1, 0],
  [2, 2],
  [3, 4]
])

var data = [
  [0, 1],
  [0.5, 0.5],
  [1, 0],
  [1.5, 1],
  [2, 2],
  [2.5, 3],
  [3, 4],
  [4, 4],
  [1000, 4],
  [-1000, 1]
]

data.forEach(function(c) {
  expect(interpolate(c[0])).to.equal(c[1])
})

  })
  
})

  }

})
