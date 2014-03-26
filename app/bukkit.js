
define(function(require) {
  
  var itself = require('itself')

  function toRational(stuff) {
    var data = stuff.split('/').map(parseFloat)
    if (data.length == 1) return +data[0]
    return data[0] / data[1]
  }

  function parse(command) {
    var match = command.match(/^([\+\-\*\/])=([\d\.\/]+)([!]?)$/)
    var number
    if (match) {
      number = toRational(match[2])
      return {
        operation: isNaN(number) ? itself('') : itself(match[1] + number),
        reset: match[3] == '!'
      }
    } else {
      number = toRational(command.replace(/^=/, '').replace(/[!]?$/, ''))
      return {
        operation: isNaN(number) ? itself('') : function() { return number },
        reset: !!command.match(/[!]$/)
      }
    }
  }

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
    var scale = 1
    return function(command) {
      var task = parse(command + '')
      value = task.operation(value)
      if (task.reset) {
        scale = value * scale
        value = 1
      }
      return value * scale
    }
  }
  
})
