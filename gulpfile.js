
var gulp = require('gulp')
var when = require('when')
var lift = require('when/node/function').lift
var mkdirp = lift(require('mkdirp'))
var passthru = lift(require('passthru'))
var es = require('event-stream')
var fs = require('fs')
var path = require('path')

var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var ngmin = require('gulp-ngmin')
var rev = require('gulp-rev')
var minifyCSS = require('gulp-minify-css')
var replace = require('gulp-replace')
var series = require('stream-series')

function env(name, what, callback) {
  if (!process.env[name]) {
    console.log(what, 'skipped. Set environment variable ' + name + ' enable.')
    return
  }
  return callback()
}

gulp.task('build', function() {
  return env('BUILD', 'game compilation', function() {
    return mkdirp('build').then(function() {
      return passthru('./node_modules/.bin/r.js -o app/build.js optimize=none out=build/main-built.js')
    })
  })
})

var connect = require('connect')
var traceur = require('traceur')

gulp.task('server', function(callback) {
  var app = connect()
  app.use(connect.static(__dirname))
  var port = +process.env.PORT || 3000
  app.listen(port, function() {
    console.log('listening, port ' + port)
  })
})

var BUILD = /<!-- build[\s\S]*\/build -->/
var CSS = /"style\.css"/

gulp.task('default', ['build'], function() {
  var context = rev.Context()
  var contextCSS = rev.Context()
  var contextGame = rev.Context()
  var gameJS = gulp.src('build/main-built.js')
  var vendorJS = gulp.src(scanVendorFiles())
  var almondJS = gulp.src('vendor/almond.js')
  console.log(scanVendorFiles())
  var game = series(vendorJS, almondJS, gameJS, gulp.src('app/main-built-launcher.js'))
    .pipe(concat('game.js'))
    .pipe(uglify())
    .pipe(rev(contextGame))
    .pipe(gulp.dest('dist/assets/js'))
  var angular = gulp.src(scanAngularFiles())
    .pipe(ngmin())
    .pipe(concat('home.js'))
    .pipe(uglify())
    .pipe(rev(context))
    .pipe(gulp.dest('dist/assets/js'))
  var css = gulp.src('*.css')
    .pipe(minifyCSS())
    .pipe(rev(contextCSS))
    .pipe(gulp.dest('dist/assets/css'))
  var html = gulp.src('index.html')
    .pipe(context.replace(BUILD, '<script src="assets/js/{{home.js}}"></script>'))
    .pipe(contextCSS.replace(CSS, '"assets/css/{{style.css}}"'))
    .pipe(replace('href="font/', 'href="assets/font/'))
    .pipe(gulp.dest('dist'))
  var gameHtml = gulp.src('game.html')
    .pipe(contextCSS.replace(CSS, '"assets/css/{{style.css}}"'))
    .pipe(contextGame.replace(BUILD, '<script src="assets/js/{{game.js}}"></script>'))
    .pipe(gulp.dest('dist'))
  var font = gulp.src('font/**/*')
    .pipe(gulp.dest('dist/assets/font'))
  var zip = gulp.src('vendor/zip.js/inflate.js')
    .pipe(gulp.dest('dist/vendor/zip.js'))
  return es.merge(game, angular, css, html, gameHtml, font, zip)
})

function scanAngularFiles() {
  return fs.readFileSync('index.html', 'utf-8')
    .match(BUILD)[0]
    .match(/src="([^"]+)"/g)
    .map(function(str) { return str.match(/"([^"]+)"/)[1] })
}

function scanVendorFiles() {
  return fs.readFileSync('game.html', 'utf-8')
    .match(BUILD)[0]
    .match(/data-package="true" src="([^"]+)"/g)
    .map(function(str) { return str.match(/src="([^"]+)"/)[1] })
}









