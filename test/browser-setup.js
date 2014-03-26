
window.TEST_MODE = {
  root: '.',
  start: function() {
    window.mocha.run()
  }
}

window.mocha.setup('bdd')

require(['chai'], function(chai) {
  window.chai = chai
  window.expect = chai.expect
  require(['test/index'])
})


