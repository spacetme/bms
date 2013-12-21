
define(function(require) {

  var _ = require('lodash')
  var bsearch = require('bsearch')

  return function Integrator(array) {

var data = []

_.each(_.sortBy(array, '0'), function(item) {
  data.push({ x: item[0], y: item[1] })
})

return function integrate(x) {
  if (data.length === 0) return 1
  var index = bsearch.lastIndex(data, function(c) { return x >= c.x })
  if (index == null) return data[0].y
  var c = data[index]
  if (c.x === x) return data[index].y
  var n = data[index + 1]
  if (n) return c.y + (n.y - c.y) * (x - c.x) / (n.x - c.x)
  else return c.y
}

  }
  
})
