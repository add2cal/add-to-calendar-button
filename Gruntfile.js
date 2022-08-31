const initCodeDelimiter = /\/\/ START INIT[\s\S]*?\/\/ END INIT/g;

function prepareFinalFile(content, exportPhrase) {
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
          prefix: '.(tiny-version">v|.?v=)',
        },
        src: ['index.html'],
      },
      js: {
        options: {
          prefix: 'Version.=..',
        },
        src: ['src/*.js'],
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
        'npm_dist/',
        'dist/',
        'assets/css/*.min.css',
        'assets/css/*.min.css.map',
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
    // generate the distributable JavaScript file
    concat: {
      dist: {
        src: ['node_modules/timezones-ical-library/dist/tzlib.js', 'src/atcb.js'],
        dest: 'dist/atcb.js',
      },
    },
    // creates the source files for the npm versionm supporting CommonJS and ES Module (https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
    copy: {
      mjs_dist: {
        nonull: true,
        src: 'dist/atcb.js',
        dest: 'npm_dist/mjs/index.js',
        options: { process: (content) => prepareFinalFile(content, 'export') },
      },
      cjs_dist: {
        nonull: true,
        src: 'dist/atcb.js',
        dest: 'npm_dist/cjs/index.js',
        options: { process: (content) => prepareFinalFile(content, 'module.exports =') },
      },
    },
    'file-creator': {
      'package.json ES Module': {
        'npm_dist/mjs/package.json': function (fs, fd, done) {
          fs.writeSync(fd, '{ "type": "module" }');
          done();
        },
      },
      'package.json commonJS': {
        'npm_dist/cjs/package.json': function (fs, fd, done) {
          fs.writeSync(fd, '{ "type": "commonjs" }');
          done();
        },
      },
      '.eslintrc.json commonJS': {
        'npm_dist/cjs/.eslintrc.json': function (fs, fd, done) {
          fs.writeSync(
            fd,
            '{ "extends": "../../.eslintrc.json", "env": { "node": true }, "plugins": ["commonjs"] }'
          );
          done();
        },
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
          'dist/atcb.min.js': ['dist/atcb.js'],
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-version');

  // Register task(s).
  grunt.registerTask('default', ['clean', 'cssmin', 'concat', 'uglify']);
  grunt.registerTask('npm', ['clean', 'cssmin', 'concat', 'copy', 'file-creator', 'uglify']);
};
