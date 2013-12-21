
define(function(require) {

  var _ = require('lodash')
  var bsearch = require('bsearch')

  return function Integrator(array) {

var data = []
var y = 0
var lx = 0
var dy = 1

_.each(_.sortBy(array, '0'), function(item) {
  var delta = dy * (item[0] - lx)
  y += delta
  data.push({ x: item[0], y: y, dy: item[1] })
  lx = item[0]
  dy = item[1]
})

return function integrate(x) {
  var last = bsearch.last(data, function(c) { return x >= c.x })
  if (last) return last.y + last.dy * (x - last.x)
  return x
}

  }
  
})
