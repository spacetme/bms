
define(function(require) {

  return {
    components: {
    },
    hooks: [
      {
        on: 'game.start',
        order: 1000,
        do: function() {
          this.desire.register({
            'game.ipad.touch': require('./touch'),
            'game.ipad.buttons': require('./buttons'),
          })
          this.desire('game.ipad.touch').bind()
        }
      },
      {
        on: 'game.frame',
        order: 1000,
        do: function() {
          this.desire('game.ipad.buttons').update()
        }
      }
    ]
  }

})
