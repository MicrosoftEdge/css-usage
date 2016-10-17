module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        src: {
            src: [
			  'src/lodash.js',
			  'src/cssShorthands.js',                                     
              'src/fwks/*',              
              'src/fwkUsage.js',               
              'src/patterns.js',
              'src/patternUsage.js',
              'src/htmlUsage.js',
              'src/cssUsage.js',
              'src/recipes/*'
            ],
            dest: 'cssUsage.src.js'
        }
    },
    babel: {
        options: {
            compact: false,
            comments: false,
            sourceMap: true,
            presets: ['es2015']
        },
        dist: {
            files: {
                'cssUsage.min.js': ['cssUsage.src.js']
            }
        }
    },
    uglify: {
      options: { maxLineLen: 0 },
      dist: {
        files: {
          'cssUsage.min.js': ['cssUsage.min.js']
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['concat:src','babel:dist']);
};