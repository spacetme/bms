
/**
 * The main function, the entry point.
 */
define(function(require) {

  return function(desire) {

var display = desire('display')
var loader = desire('loader')

function main() {

  display.renderTo(document.body)

  loader.load(
    sessionStorage['music.path'] || 'music/default/sawasdee-new-year',
    sessionStorage['music.bms'] || 'sawasdee-new-year-normal.bms'
  ).done()

}

return { main: main }

  }

})
