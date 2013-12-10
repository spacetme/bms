/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    bower: {
      target: {
        rjsConfig: 'app/requirejs-config.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-bower-requirejs')

  grunt.registerTask('default', ['bower'])

};
