
define(function(require) {
  
  var itself = require('itself')

  /**
   * This bukkit is a value manipulator.
   *
   * Example:
   * var b = bukkit()
   * b('=2') => 2
   * b('+=1') => 3
   * b('+=1/2') => 3.5
   */
  return function Bukkit() {
    var value = 1
    return function(command) {
      command = '' + command
      var match = command.match(/^([\+\-\*\/])=([\d\.\/]+)$/)
      var number
      if (match) {
        number = toRational(match[2])
        if (isNaN(number)) return value
        value = itself(match[1] + number)(value)
      } else {
        number = toRational(command.replace(/^=/, ''))
        if (isNaN(number)) return value
        value = number
      }
      return value
    }
    function toRational(stuff) {
      var data = stuff.split('/').map(parseFloat)
      if (data.length == 1) return +data[0]
      return data[0] / data[1]
    }
  }
  
})
