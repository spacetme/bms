define(function(require) {

  return {
    components: {
      main: require('./main'),
      display: require('./display'),
      Game: require('./game'),
      game_manager: require('./game_manager')
    },
    hooks: [
      {
        on: 'main',
        order: 1,
        do: function() {
          this.desire('main').run()
        }
      },
      {
        on: 'game.frame',
        order: 1,
        do: function() {
          this.desire('game.state').update()
        }
      },
      {
        on: 'game.frame',
        order: 2,
        do: function() {
          this.desire('game.keysound').autoplay()
        }
      },
      {
        on: 'game.frame',
        order: 100,
        do: function(event) {
          this.desire('game.render.notes').render()
        }
      },
      {
        on: 'game.column.down',
        order: 20,
        do: function(event) {
          this.desire('game.keysound').hit(event)
        }
      }
    ]
  }

})
