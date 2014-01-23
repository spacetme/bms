
var gulp = require('gulp')
var when = require('when')
var lift = require('when/node/function').lift
var mkdirp = lift(require('mkdirp'))
var passthru = lift(require('passthru'))
var es = require('event-stream')
var fs = require('fs')

var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var ngmin = require('gulp-ngmin')
var rev = require('gulp-rev')
var minifyCSS = require('gulp-minify-css')

gulp.task('build', function() {
  return mkdirp('build').then(function() {
    return passthru('./node_modules/.bin/r.js -o app.build.js optimize=none out=build/main-built.js')
  })
})

var BUILD = /<!-- build[\s\S]*\/build -->/
var CSS = /"style\.css"/

gulp.task('default', function() {
  var context = rev.Context()
  var contextCSS = rev.Context()
  var game = gulp.src('build/main-built.js')
    .pipe(uglify())
    .pipe(rename('js/game.js'))
    .pipe(gulp.dest('dist'))
  var angular = gulp.src(scanAngularFiles())
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(concat('js/home.js'))
    .pipe(rev(context))
    .pipe(gulp.dest('dist'))
  var css = gulp.src('*.css')
    .pipe(minifyCSS())
    .pipe(rev(contextCSS))
    .pipe(gulp.dest('dist/css'))
  var html = gulp.src('index.html')
    .pipe(context.replace(BUILD, '<script src="{{js/home.js}}"></script>'))
    .pipe(contextCSS.replace(CSS, '"css/{{style.css}}"'))
    .pipe(gulp.dest('dist'))
  var gameHtml = gulp.src('game.html')
    .pipe(contextCSS.replace(CSS, '"css/{{style.css}}"'))
    .pipe(gulp.dest('dist'))
  return es.merge(game, angular, css, html, gameHtml)
})

function scanAngularFiles() {
  return fs.readFileSync('index.html', 'utf-8')
    .match(BUILD)[0]
    .match(/src="([^"]+)"/g)
    .map(function(str) { return str.match(/"([^"]+)"/)[1] })
}










