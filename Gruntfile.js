const fs = require('fs');

function prepareFinalFile(content, stripAllImport = true, stripAllExport = true, transformToCommonJS = false) {
  // remove TimeZones iCal Library version output (do not do this, if your are using the time zone library standalone!)
  content = content.replace(/^console\.log\('Add to Calendar TimeZones iCal Library loaded \(version ' \+ tzlibVersion \+ '\)'\);$/m, '');
  // add style inline
  const styleRegex = /const\satcbCssTemplate\s=\s\{\};/;
  if (styleRegex.test(content)) {
    const availableStyles = ['default', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];
    let inlineStyleOutput = 'const atcbCssTemplate = {';
    availableStyles.forEach((style) => {
      const styleString = (function () {
        if (style != 'default') {
          return '-' + style;
        }
        return '';
      })();
      // determining the input data. Mind that we remove any multiple "." as well as backslashs for security reasons - should not be used anyway
      const cssFileContent = fs
        .readFileSync('./assets/css/atcb' + styleString + '.min.css')
        .toString()
        .replace(/\.{2,}/g, '')
        .replace(/\\/g, '')
        .replace(/"/g, '\\"');
      inlineStyleOutput += '\r\n"' + style + '": "' + cssFileContent + '",';
    });
    inlineStyleOutput += '\r\n};\r\n';
    content = content.replace(styleRegex, inlineStyleOutput);
  }
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
  if (transformToCommonJS) {
    content = content
      .replace(/tzlib_get_offset/gm, 'tzlibActions.tzlib_get_offset')
      .replace(/tzlib_get_ical_block/gm, 'tzlibActions.tzlib_get_ical_block')
      .replace(/tzlib_get_timezones/gm, 'tzlibActions.tzlib_get_timezones');
  }
  return content;
}

const jsCoreFilesToCombine = ['src/atcb-globals.js', 'src/atcb-decorate.js', 'src/atcb-validate.js', 'src/atcb-control.js', 'src/atcb-generate.js', 'src/atcb-generate-rich-data.js', 'src/atcb-links.js', 'src/atcb-util.js', 'src/atcb-event.js', 'src/atcb-i18n.js', 'src/atcb-init.js'];

// The config.
module.exports = function (grunt) {
  grunt.initConfig({
    // update version. Either use via `npm run release -- patch` (default), `npm run release -- minor`, `npm run release -- major`, or `npm run release -- x.x.x` (with x.x.x being the exact version number)
    version: {
      package: {
        src: ['package.json'],
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
      demo: {
        options: {
          prefix: 'Version:.',
        },
        src: ['demo/components/footer.vue'],
      },
    },
    // cleans old built files
    clean: {
      oldBuildFiles: ['dist/', 'assets/css/*.min.css', 'assets/css/*.min.css.map', 'demo_assets/css/*.min.css', 'demo_assets/css/*.min.css.map', 'demo_assets/js/*.js.css', 'demo_assets/js/*.min.js.map'],
    },
    // minifies the css file
    cssmin: {
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
    // generate the distributable JavaScript files (and also add a customized css file to the demo)
    concat: {
      main: {
        src: ['node_modules/timezones-ical-library/dist/tzlib.js', ...jsCoreFilesToCombine],
        dest: 'dist/atcb.js',
        options: {
          stripBanners: true,
          banner: '( function(atcbGlobal) { ',
          footer: ' } )(window);',
          process: (content) => prepareFinalFile(content),
        },
      },
      module: {
        src: jsCoreFilesToCombine,
        dest: 'dist/module/index.js',
        options: {
          stripBanners: true,
          banner: "import { tzlib_get_ical_block, tzlib_get_offset, tzlib_get_timezones } from 'timezones-ical-library';\r\n",
          footer: 'export { atcb_action };',
          process: (content) => prepareFinalFile(content),
        },
      },
      commonJS: {
        src: jsCoreFilesToCombine,
        dest: 'dist/commonjs/index.js',
        options: {
          stripBanners: true,
          banner: "// eslint-disable-next-line @typescript-eslint/no-var-requires\r\nconst tzlibActions = require('timezones-ical-library');\r\n",
          footer: 'module.exports = { atcb_action };',
          process: (content) => prepareFinalFile(content, true, true, true),
        },
      },
      cssDemo: {
        src: ['assets/css/atcb.css'],
        dest: 'demo/public/atcb.css',
        options: {
          footer: ':host { --btn-background: #ffa255; }:host(.atcb-dark), :host-context(html.atcb-dark):host(.atcb-bodyScheme), :host-context(body.atcb-dark):host(.atcb-bodyScheme) { --btn-background: #000; }',
        },
      },
    },
    // creates files to support the dist structure
    'file-creator': {
      'package.json ES Module': {
        'dist/module/package.json': function (fs, fd, done) {
          fs.writeSync(fd, '{ "type": "module" }');
          done();
        },
      },
      'package.json commonJS': {
        'dist/commonjs/package.json': function (fs, fd, done) {
          fs.writeSync(fd, '{ "type": "commonjs" }');
          done();
        },
      },
      '.eslintrc.json commonJS': {
        'dist/commonjs/.eslintrc.json': function (fs, fd, done) {
          fs.writeSync(fd, '{ "extends": "../../.eslintrc.json", "env": { "node": true }, "plugins": ["commonjs"] }');
          done();
        },
      },
    },
    // minifies the main js file
    uglify: {
      options: {
        compress: true,
        mangle: true,
        beautify: false,
        sourceMap: false,
        banner: '/* eslint-disable @typescript-eslint/no-unused-vars */',
        output: {
          comments: 'some',
        },
      },
      newBuild: {
        files: {
          'dist/atcb.js': ['dist/atcb.js'],
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
  grunt.registerTask('default', ['clean', 'cssmin', 'concat', 'file-creator', 'uglify']);
};
