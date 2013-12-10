
define(function(require) {
  
  function bsearch(array, fn) {
    var l = 0, r = array.length - 1
    while (l <= r) {
      var m = Math.floor((l + r) / 2)
      var p = (m - 1 < 0 || !fn(array[m - 1]))
      var c = fn(array[m])
      if (p && c) {
        return m
      } else if (c) {
        r = m - 1
      } else {
        l = m + 1
      }
    }
    return null
  }

  bsearch.first = function(array, fn) {
    var index = bsearch(array, fn)
    if (index != null) return array[index]
    return null
  }

  bsearch.lastIndex = function(array, fn) {
    var index = bsearch(array, function(x) { return !fn(x) })
    if (index == null) return array.length - 1
    if (index === 0) return null
    return index - 1
  }

  bsearch.last = function(array, fn) {
    var index = bsearch.lastIndex(array, fn)
    if (index == null) return null
    return array[index]
  }

  return bsearch

})
