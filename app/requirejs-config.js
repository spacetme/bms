requirejs.config({
  baseUrl: './app',
  shim: {
    bms: {
      deps: [
        'lodash'
      ],
      exports: 'BMS'
    },
    sinon: {
      exports: 'sinon'
    },
    pixi: {
      exports: 'PIXI'
    }
  },
  packages: [
    {
      name: 'when',
      location: '../bower_components/when',
      main: 'when'
    }
  ],
  preloads: [
    'when/monitor/console'
  ],
  paths: {
    lodash: '../bower_components/lodash/dist/lodash.compat',
    desire: '../bower_components/desire/desire',
    bms: '../vendor/bms',
    chai: '../bower_components/chai/chai',
    sinon: '../vendor/sinon-1.7.3',
    pixi: '../vendor/pixi.dev',
    eventemitter2: '../bower_components/eventemitter2/lib/eventemitter2',
    when: '../bower_components/when/when'
  }
})
