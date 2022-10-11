function prepareFinalFile(
  content,
  stripAllImport = true,
  stripAllExport = true,
  newExportPhrase = '',
  transformToCommonJS = false
) {
  // remove TimeZones iCal Library version output (do not do this, if your are using the time zone library standalone!)
  content = content.replace(
    /^console\.log\('Add to Calendar TimeZones iCal Library loaded \(version ' \+ tzlibVersion \+ '\)'\);$/m,
    ''
  );
  if (stripAllImport) {
    // remove all import statements
    content = content.replace(/^import[\w\s{}\+-_,'"`\/\\.]*';/gim, '');
    // remove regular comments
    content = content.replace(/(^|(?<=;\s))\s*\/\/(?!\seslint).*$/gm, '');
    // remove empty lines
    content = content.replace(/^\s*$(?:\r\n?|\n)/gm, '');
  }
  if (stripAllExport) {
    // remove all export statements
    content = content.replace(/^export {[\w\s-_,]*};/gim, '');
  }
  if (newExportPhrase != '') {
    // remove export statements
    content = content.replace(
      /^\/\*! START INIT \*\/[\s\S]*?\/\*! END INIT \*\/$/gm,
      `${newExportPhrase} { atcb_action, atcb_init };`
    );
  }
  if (transformToCommonJS) {
    content = content
      .replace(/tzlib_get_offset/gm, 'tzlibActions.tzlib_get_offset')
      .replace(/tzlib_get_ical_block/gm, 'tzlibActions.tzlib_get_ical_block')
      .replace(/tzlib_get_timezones/gm, 'tzlibActions.tzlib_get_timezones');
  }
  return content;
}

// The config.
module.exports = function (grunt) {
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
          prefix: 'Version(.=..|:.)',
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
    // generate the distributable JavaScript files
    // for the npm version supporting CommonJS and ES Module (https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html)
    concat: {
      dist: {
        src: [
          'node_modules/timezones-ical-library/dist/tzlib.js',
          'src/atcb-globals.js',
          'src/atcb-decorate.js',
          'src/atcb-validate.js',
          'src/atcb-control.js',
          'src/atcb-generate.js',
          'src/atcb-links.js',
          'src/atcb-util.js',
          'src/atcb-i18n.js',
          'src/atcb-init.js',
          'src/atcb.js',
        ],
        dest: 'dist/atcb.js',
        options: {
          stripBanners: true,
          process: (content) => prepareFinalFile(content),
        },
      },
      mjs_dist: {
        src: [
          'src/atcb-globals.js',
          'src/atcb-decorate.js',
          'src/atcb-validate.js',
          'src/atcb-control.js',
          'src/atcb-generate.js',
          'src/atcb-links.js',
          'src/atcb-util.js',
          'src/atcb-i18n.js',
          'src/atcb-init.js',
          'src/atcb.js',
        ],
        dest: 'npm_dist/mjs/index.js',
        options: {
          stripBanners: true,
          banner:
            "import { tzlib_get_ical_block, tzlib_get_offset, tzlib_get_timezones } from 'timezones-ical-library';\n\n",
          process: (content) => prepareFinalFile(content, true, true, 'export'),
        },
      },
      cjs_dist: {
        src: [
          'src/atcb-globals.js',
          'src/atcb-decorate.js',
          'src/atcb-validate.js',
          'src/atcb-control.js',
          'src/atcb-generate.js',
          'src/atcb-links.js',
          'src/atcb-util.js',
          'src/atcb-i18n.js',
          'src/atcb-init.js',
          'src/atcb.js',
        ],
        dest: 'npm_dist/cjs/index.js',
        options: {
          stripBanners: true,
          banner:
            "// eslint-disable-next-line @typescript-eslint/no-var-requires\r\nconst tzlibActions = require('timezones-ical-library');\n\n",
          process: (content) => prepareFinalFile(content, true, true, 'module.exports =', true),
        },
      },
    },
    // creates files to support the npm dist structure
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
        output: {
          comments: 'some',
        },
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-version');

  // Register task(s).
  grunt.registerTask('default', ['clean', 'cssmin', 'concat:dist', 'uglify']);
  grunt.registerTask('npm', ['clean', 'cssmin', 'concat', 'file-creator', 'uglify']);
};
