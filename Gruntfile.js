module.exports = function(grunt) {

  // The config.
  grunt.initConfig({
    clean: { // cleans old built files
      oldBuildFiles: ['assets/js/atcb.min.js', 'assets/js/atcb.min.js.map', 'assets/css/atcb.min.css', 'assets/css/atcb.min.css.map', 'npm_dist/']
    },
    copy: {
      npm_dist: { // creates the source file for the npm version
        src: 'assets/js/atcb.js', 
        dest: 'npm_dist/atcb_npm.js',
        options: {
          process: function (content) {
            return content.replace(/\/\/ START INIT[\s\S]*?\/\/ END INIT/g,"export { atcb_init };");
          }
        }
      }
    },
    uglify: { // minifies the main js file
      options: {
        compress: true,
        mangle: true,
        sourceMap: true
      },
      newBuild: {
        files: {
          'assets/js/atcb.min.js': ['assets/js/atcb.js']
        }
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      newBuild: {
        files: {
          'assets/css/atcb.min.css': ['assets/css/atcb.css']
        }
      }
    }
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Register task(s).
  grunt.registerTask('default', ['clean', 'copy', 'uglify', 'cssmin']);

};