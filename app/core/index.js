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
        order: 0,
        do: function() {
          this.desire('game.state').update()
        }
      },
      {
        on: 'game.frame',
        order: 10,
        do: function() {
          this.desire('game.keysound').autoplay()
        }
      },
      {
        on: 'game.frame',
        order: 20,
        do: function(event) {
          this.desire('game.judges').update()
        }
      },
      {
        on: 'game.frame',
        order: 100,
        do: function(event) {
          this.desire('game.render.bar').render()
          this.desire('game.render.notes').render()
        }
      },
      {
        on: 'game.frame',
        order: 110,
        do: function() {
          this.desire('game.theme').update()
        }
      },
      {
        on: 'game.column.down',
        order: 10,
        do: function(event) {
          this.desire('game.judges')[event.column].down()
        }
      },
      {
        on: 'game.column.down',
        order: 10,
        do: function(event) {
          if (event.column == 3) {
            this.desire('game.ready').fire()
          }
        }
      },
      {
        on: 'game.column.up',
        order: 10,
        do: function(event) {
          this.desire('game.judges')[event.column].up()
        }
      },
      {
        on: 'game.judgment.blank',
        order: 20,
        do: function(event) {
          this.desire('game.keysound').blank(event.column)
        }
      },
      {
        on: 'game.judgment.hit',
        order: 20,
        do: function(event) {
          if (event.result != 'miss') {
            this.desire('game.keysound').hit(event.note)
          }
        }
      },
      {
        on: 'game.judgment.release',
        order: 20,
        do: function(event) {
          if (event.result == 'miss') {
            this.desire('game.keysound').break(event.note)
          } else {
            this.desire('game.keysound').release(event.note)
          }
        }
      },
      {
        on: 'game.judgment',
        order: 20,
        do: function(event) {
          this.desire('game.state').handleJudgment(event)
        }
      }
    ]
  }

})
