module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
    },
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
              'src/recipes/*',    
              'src/init.js'     
            ],
            dest: 'cssUsage.src.js'
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat:src']);
};