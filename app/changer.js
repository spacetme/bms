
define(function(require) {
  
  return function Changer(fn, value) {

    fn(value)

    return function change(newValue) {
      if (newValue != value) {
        fn(newValue, value)
        value = newValue
      }
    }
    
  }

})
