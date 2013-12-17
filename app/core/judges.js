
define(function(require) {
  
  return function(desire) {

    var judges = [ ]
    var columns = desire('game.notechart').columns
    var Judge = desire('game.Judge')

    for (var i = 0; i < columns; i ++) {
      judges.push(new Judge(i))
    }

    judges.update = function() {
      for (var i = 0; i < judges.length; i ++) {
        judges[i].update()
      }
    }

    return judges
    
  }

})
