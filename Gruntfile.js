const initCodeDelimiter = /\/\/ START INIT[\s\S]*?\/\/ END INIT/g;

function process(content, exportPhrase) {
  return content.replace(initCodeDelimiter, `${exportPhrase} { atcb_action, atcb_init };`);
}
module.exports = function (grunt) {
  // The config.
  grunt.initConfig({
    // update version. Either use via `npm run release -- patch` (default), `npm run release -- minor`, `npm run release -- major`, or `npm run release -- x.x.x` (with x.x.x being the exact version number)
    version: {
      package: {
        src: ['package.json'],
      },
      demoHtml: {
        options: {
          prefix: '.(tinyVersion">v|.?v=)',
        },
        src: ['index.html'],
      },
      js: {
        options: {
          prefix: 'Version.=..',
        },
        src: ['assets/js/*.js'],
      },
      css: {
        options: {
          prefix: 'Version:.',
        },
        src: ['assets/css/*.css'],
      },
    },
    // cleans old built files
    clean: {
      oldBuildFiles: [
        'assets/js/*.min.js',
        'assets/js/*.min.js.map',
        'assets/css/*.min.css',
        'assets/css/*.min.css.map',
        'npm_dist/cjs/*.js',
        'npm_dist/mjs/',
        'demo_assets/css/*.min.css',
        'demo_assets/css/*.min.css.map',
        'demo_assets/js/*.js.css',
        'demo_assets/js/*.min.js.map',
      ],
    },
    // minifies the css file
    cssmin: {
      options: {
        sourceMap: true,
      },
      minify: {
        files: [
          {
            expand: true,
            cwd: 'assets/css',
            src: ['*.css', '!*.min.css'],
            dest: 'assets/css',
            ext: '.min.css',
          },
          {
            expand: true,
            cwd: 'demo_assets/css',
            src: ['*.css', '!*.min.css'],
            dest: 'demo_assets/css',
            ext: '.min.css',
          },
        ],
      },
    },
    // creates the source files for the npm versionm supporting CommonJS and ES Module (https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
    copy: {
      mjs_dist: {
        src: 'assets/js/atcb.js',
        dest: 'npm_dist/mjs/index.js',
        options: { process: (content) => process(content, 'export') },
      },
      cjs_dist: {
        src: 'assets/js/atcb.js',
        dest: 'npm_dist/cjs/index.js',
        options: { process: (content) => process(content, 'module.exports =') },
      },
    },
    // minifies the main js file
    uglify: {
      options: {
        compress: true,
        mangle: true,
        sourceMap: true,
      },
      newBuild: {
        files: {
          'assets/js/atcb.min.js': ['assets/js/atcb.js'],
          'demo_assets/js/demopage.min.js': ['demo_assets/js/demopage.js'],
        },
      },
    },
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-version');

  // Register task(s).
  grunt.registerTask('default', ['clean', 'cssmin', 'copy', 'uglify']);
};
