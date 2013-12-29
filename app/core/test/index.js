
define(function(require) {
  
  return function() {
    require('./entities_spec')()
    require('./game_metrics_spec')()
    require('./stage_manager_spec')()
    require('./judge_spec')()
    require('./judgment_spec')()
    require('./zip_preloader_spec')()
  }

})
