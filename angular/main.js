
/*global angular, jsyaml*/
angular.module('bms.main', ['ngRoute', 'ngSanitize'])
.service('hash', function() {
  return { encode: encode, decode: decode }
  function encode(x) {
    return encodeURIComponent(x).replace(/\./g, '%2E').replace(/%/g, '.')
  }
  function decode(x) {
    return decodeURIComponent(('' + x).replace(/\./g, '%'))
  }
})
.service('yaml', function($http, $q) {
  var cache = { }
  return { load: load }
  function load($scope, url) {
    if (cache[url]) return $q.when(cache[url])
    return $http.get(url).then(function(result) {
      $scope.loading = true
      return jsyaml.safeLoad(result.data)
    })
    .then(function(data) {
      $scope.error = null
      cache[url] = data
      return data
    })
    .catch(function(error) {
      $scope.error = error
    })
    .finally(function() {
      $scope.loading = false
    })
  }
})
.service('path', function() {
  return { join: join }
  function join(a, b) {
    return ('' + a).replace(/\/$/g, '') + '/' + b
  }
})
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'angular/partials/main.html',
    controller: 'ControllerSelectController'
  })
  .when('/collection/:url', {
    templateUrl: 'angular/partials/select-music.html',
    controller: 'MusicSelectController'
  })
  .when('/collection/:url/:id', {
    templateUrl: 'angular/partials/music.html',
    controller: 'MusicController'
  })
  .when('/about', {
    templateUrl: 'angular/partials/about.html',
    controller: 'AboutController'
  })
  .otherwise({
    redirectTo: '/'
  })
})
.service('collections', function(yaml) {
  return { load: load }

  function load($scope, url) {
    return yaml.load($scope, url)
    .then(function(collection) {
      collection.music.forEach(processMusic)
      return collection
    })
  }
  function processMusic(music) {
    var levels = []
    for (var key in music.level) {
      if (Object.prototype.hasOwnProperty.call(music.level, key)) {
        var level = parseInfo(key)
        level.bms = music.level[key]
        levels.push(level)
      }
    }
    levels.sort(function(a, b) {
      return a.level < b.level ? -1 : 1
    })
    music.levels = levels
  }
  function parseInfo(key) {
    var m = ('' + key).match(/^(\d+)(ES|NM|HD|EX)(\d+)$/i)
    if (!m) {
      return { keys: '??', difficulty: '??', level: '??' }
    }
    return { keys: m[1], difficulty: m[2].toUpperCase(), level: +m[3] }
  }

})
.controller('BMSMainController', function($scope) {

  $scope.route = { name: '' }
  $scope.marked = window.marked

})
.controller('ControllerSelectController', function($scope, yaml, $location, hash) {
  $scope.route.name = 'play'
  yaml.load($scope, 'collections.yml')
  .then(function(collections) {
    $scope.collections = collections
  })
  $scope.collectionURL = function(url) {
    return '#/collection/' + hash.encode(url)
  }
  $scope.manual = function() {
    var url = window.prompt('Enter collection URL', 'http://')
    if (url != null) location.href = $scope.collectionURL(url)
  }
})
.controller('MusicSelectController', function($scope, collections, $location, $routeParams, hash, path) {
  var url = hash.decode($routeParams.url)
  $scope.route.name = 'play'
  collections.load($scope, path.join(url, 'collection.yml'))
  .then(function(collection) {
    $scope.collection = collection
  })

  $scope.musicURL = function(music) {
    return '#/collection/' + hash.encode(url) + '/' + hash.encode(music.id)
  }

})
.controller('AboutController', function($scope) {
  $scope.route.name = 'about'
})
.controller('MusicController', function($scope, hash, path, $routeParams, collections) {
  var url = hash.decode($routeParams.url)
  var id = hash.decode($routeParams.id)
  $scope.route.name = 'play'
  collections.load($scope, path.join(url, 'collection.yml'))
  .then(function(collection) {
    $scope.collection = collection
    for (var i = 0; i < collection.music.length; i ++) {
      if (collection.music[i].id == id) {
        $scope.music = collection.music[i]
        break
      }
    }
  })
  $scope.play = function(level) {
    sessionStorage['music.path'] = path.join(url, $scope.music.path)
    sessionStorage['music.bms'] = level.bms
  }
})












