
define(function(require) {

  return function(desire) {
    
    var speed = { current: 1, target: 3, lockCount: 0,
      lock: function() { speed.lockCount += 1 },
      unlock: function() { speed.lockCount -= 1 } }

    speed.update = function() {
      if (speed.lockCount === 0) {
        speed.current += (speed.target - speed.current) / 5
      }
    }

    speed.increase = function() {
      speed.set(speed.target + 0.5)
    }

    speed.decrease = function() {
      speed.set(speed.target - 0.5)
    }

    speed.set = function(target) {
      speed.target = Math.round(target / 0.5) * 0.5
      if (speed.target < 0.5) speed.target = 0.5
      if (speed.target > 8) speed.target = 8
    }

    return speed

  }
  
})

