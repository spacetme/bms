
define(function(require) {

  var expect = require('chai').expect
  var Integrator = require('integrator')
  
  return function() {

describe('Integrator', function() {

  it('should be identity when blank', function() {

var integrate = new Integrator([])

var data = [
  [0, 0],
  [0.5, 0.5],
  [1, 1],
  [1.5, 1.5],
  [2, 2],
  [2.5, 2.5],
  [3, 3],
  [4, 4],
  [1000, 1000],
  [-1000, -1000]
]

data.forEach(function(c) {
  expect(integrate(c[0])).to.equal(c[1])
})

  })

  it('should integrate distance over time', function() {

var integrate = new Integrator([
  [0, 1],
  [1, 0],
  [2, 2],
  [3, 1]
])

var data = [
  [0, 0],
  [0.5, 0.5],
  [1, 1],
  [1.5, 1],
  [2, 1],
  [2.5, 2],
  [3, 3],
  [4, 4],
  [1000, 1000],
  [-1000, -1000]
]

data.forEach(function(c) {
  expect(integrate(c[0])).to.equal(c[1])
})

  })
  
})

  }

})
