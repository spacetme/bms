
define(function(require) {
  
  var cache = { }

  return function itself(code) {
    return cache[code] || (cache[code] = new Function('its', 'return its' + code))
  }

})
