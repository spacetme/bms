
define(function(require) {

  require('./bsearch_spec')()
  require('./bukkit_spec')()
  require('./changer_spec')()
  require('./enums_spec')()
  require('./gimmick_spec')()
  require('./guard_modification_spec')()
  require('./hook_spec')()
  require('./integrator_spec')()
  require('./interpolator_spec')()
  require('./mixin_spec')()
  require('./note_data_spec')()
  require('./notechart_spec')()
  require('./object_id_spec')()
  require('./object_pool_spec')()
  require('./time_signatures_spec')()
  require('./timing_data_spec')()

  var load = require('modules_loader')
  var config = require('config')

  load(config.plugins, 'test/index').then(function(modules) {
    modules.forEach(function(fn) { fn() })
  }).then(function() {
    TEST_MODE.start()
  }).done()

})

