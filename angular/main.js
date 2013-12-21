
/*global angular, jsyaml*/
angular.module('bms.main', ['ngRoute'])
.service('hash', function() {
  return { encode: encode, decode: decode }
  function encode(x) {
    return encodeURIComponent(x).replace(/\./g, '%2E').replace(/%/g, '.')
  }
  function decode(x) {
    return decodeURIComponent(('' + x).replace(/\./g, '%'))
  }
})
.service('yaml', function($http) {
  return { load: load }
  function load($scope, url) {
    return $http.get(url).then(function(result) {
      $scope.loading = true
      return jsyaml.safeLoad(result.data)
    })
    .then(function(data) {
      $scope.error = null
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
  .when('/about', {
    templateUrl: 'angular/partials/about.html',
    controller: 'AboutController'
  })
  .otherwise({
    redirectTo: '/'
  })
})
.controller('BMSMainController', function($scope) {
  $scope.route = { name: '' }
})
.controller('ControllerSelectController', function($scope, yaml, $location, hash) {
  $scope.route.name = 'play'
  yaml.load($scope, 'collections.yml')
  .then(function(collections) {
    $scope.collections = collections
  })
  $scope.useCollection = function(url) {
    $location.path('/collection/' + hash.encode(url))
  }
})
.controller('MusicSelectController', function($scope, yaml, $location, $routeParams, hash, path) {
  var url = hash.decode($routeParams.url)
  $scope.route.name = 'play'
  yaml.load($scope, path.join(url, 'collection.yml'))
  .then(function(collection) {
    $scope.collection = collection
  })

  $scope.keys = function(text) { return parseInfo(text).keys }
  $scope.difficulty = function(text) { return parseInfo(text).difficulty }
  $scope.level = function(text) { return parseInfo(text).level }

  function parseInfo(key) {
    var m = ('' + key).match(/^(\d+)(ES|NM|HD|EX)(\d+)$/i)
    if (!m) {
      return { keys: '??', difficulty: '??', level: '??' }
    }
    return { keys: m[1], difficulty: m[2].toUpperCase(), level: m[3] }
  }
})
.controller('AboutController', function($scope) {
  $scope.route.name = 'about'
})












