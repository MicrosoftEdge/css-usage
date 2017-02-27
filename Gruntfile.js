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
              'src/recipes/*',    
              'src/init.js',
              'src/crawl/prepareTsv.js'
            ],
            dest: 'cssUsage.src.js'
        }
    },
    strip_code: {
      options: {
        blocks: [
          {
            start_block: "/* Start Recipe Removal Block */",
            end_block: "/* End Recipe Removal Block */"
          }
        ],
        your_target: {
            src: 'cssUsage.src.js'
        }
      } // end options
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.registerTask('default', ['concat', 'strip_code']);
};