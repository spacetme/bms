
requirejs.config({
  packages: [
    { name: 'when', location: 'path/to/when/', main: 'when' }
  ]
})

void function(global) {
  global('desire', window.Desire)
  global('_',      window._)
  global('bms',    window.bms)
}(function global(name, object) {
  define(name, function() { return object })
})

