
define(function(require) {

  return function() {
    require('./mixin_spec')()
    require('./hooks_spec')()
    require('./enums_spec')()
    require('./changer_spec')()
    require('./notechart_spec')()
    require('./bsearch_spec')()
    require('./guard_modification_spec')()
    require('./timing_data_spec')()
    require('./time_signatures_spec')()
    require('./note_data_spec')()
    require('./object_id_spec')()
    require('./object_pool_spec')()
    require('../core/test/index')()
  }
  
})

