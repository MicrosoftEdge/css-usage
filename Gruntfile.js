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
              'src/crawl/prepareTsv.js',
              'src/init.js'
            ],
            dest: 'cssUsage.src.js'
        }
    },
    strip_code: {
      options: {
        patterns: [
          /currentRowTemplate.push\(\'(css|dom|html)\'\);/g,
          /convertToTSV\(INSTRUMENTATION_RESULTS\[\'(css|dom|html)\'\]\);[\n\r]+\s+currentRowTemplate.pop\(\);/g
        ]
      },
      your_target: {
        files: [
          {src: 'cssUsage.src.js', dest: 'Recipe.min.js'}
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.registerTask('default', ['concat', 'strip_code']);
};