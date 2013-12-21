
define(function(require) {

  var expect = require('chai').expect
  var Bukkit = require('bukkit')
  
  return function() {

describe('Bukkit', function() {

  it('should change and return new value', function() {

var bukkit = new Bukkit()

var data = [
  ['=2', 2],
  [123, 123],
  [2, 2],
  ['+=1', 3],
  ['+=1/2', 3.5],
  ['*=2', 7]
]

data.forEach(function(c) {
  expect(bukkit(c[0])).to.equal(c[1])
})

  })
  
})

  }

})
