const npmDelimiter = /\/\/ START INIT[\s\S]*?\/\/ END INIT/gm

function process(content, exportPhrase) {
  return content.replace(npmDelimiter, `${exportPhrase} { atcb_action, atcb_init };`);
}
module.exports = function(grunt) {

  // The config.
  grunt.initConfig({
    clean: { // cleans old built files
      oldBuildFiles: ['assets/js/atcb.min.js', 'assets/js/atcb.min.js.map', 'assets/css/atcb.min.css', 'assets/css/atcb.min.css.map', 'npm_dist/']
    },
    copy: { // creates the source files for the npm versionm supporting CommonJS and ES Module (https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
      mjs_dist: {
        src: 'assets/js/atcb.js',
        dest: 'npm_dist/mjs/index.js',
        options: { process: content => process(content, "export") }
      },
      cjs_dist: {
        src: 'assets/js/atcb.js',
        dest: 'npm_dist/cjs/index.js',
        options: { process: content => process(content, "module.exports =") }
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
    cssmin: { // minifies the main css file
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