module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'cssUsage.min.js': ['src/cssUsage.js']
        }
      }
    },
    mocha: {
      all: {
        src: ['test/test.html']
      },
      options: {
        run: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'mocha']);
};