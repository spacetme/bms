
/*global requirejs*/
requirejs.config({
  baseUrl: '/base/app'
})

require(['chai'], function(chai) {
  window.chai = chai
  window.expect = chai.expect
  require(['test/index'])
})

window.TEST_MODE = {
  root: '/base',
  start: window.__karma__.start
}


