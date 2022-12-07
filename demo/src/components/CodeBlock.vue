<script setup>
import { h } from 'vue'
import Prism from 'prismjs';
</script>

<script>
export default {
  props: {
    class: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'html'
    }
  },
  methods: {
    addPrismPlugins() {
        /**
         * Plugin name which is used as a class name for <pre> which is activating the plugin
         *
         * @type {string}
         */
        const PLUGIN_NAME = 'line-numbers';

        /**
         * Regular expression used for determining line breaks
         *
         * @type {RegExp}
         */
        const NEW_LINE_EXP = /\n(?!$)/g;


        /**
         * Global exports
         */
          const config = Prism.plugins.lineNumbers = {
          /**
           * Get node for provided line number
           *
           * @param {Element} element pre element
           * @param {number} number line number
           * @returns {Element|undefined}
           */
          getLine: function (element, number) {
            if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
              return;
            }

            var lineNumberRows = element.querySelector('.line-numbers-rows');
            if (!lineNumberRows) {
              return;
            }
            var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
            var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

            if (number < lineNumberStart) {
              number = lineNumberStart;
            }
            if (number > lineNumberEnd) {
              number = lineNumberEnd;
            }

            var lineIndex = number - lineNumberStart;

            return lineNumberRows.children[lineIndex];
          },

          /**
           * Resizes the line numbers of the given element.
           *
           * This function will not add line numbers. It will only resize existing ones.
           *
           * @param {HTMLElement} element A `<pre>` element with line numbers.
           * @returns {void}
           */
          resize: function (element) {
            resizeElements([element]);
          },

          /**
           * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
           * the current viewport.
           *
           * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
           *
           * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
           *
           * @type {boolean}
           */
          assumeViewportIndependence: true
        };

        /**
         * Resizes the given elements.
         *
         * @param {HTMLElement[]} elements
         */
        function resizeElements(elements) {
          elements = elements.filter(function (e) {
            var codeStyles = getStyles(e);
            var whiteSpace = codeStyles['white-space'];
            return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
          });

          if (elements.length == 0) {
            return;
          }

          var infos = elements.map(function (element) {
            var codeElement = element.querySelector('code');
            var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
            if (!codeElement || !lineNumbersWrapper) {
              return undefined;
            }

            /** @type {HTMLElement} */
            var lineNumberSizer = element.querySelector('.line-numbers-sizer');
            var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

            if (!lineNumberSizer) {
              lineNumberSizer = document.createElement('span');
              lineNumberSizer.className = 'line-numbers-sizer';

              codeElement.appendChild(lineNumberSizer);
            }

            lineNumberSizer.innerHTML = '0';
            lineNumberSizer.style.display = 'block';

            var oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
            lineNumberSizer.innerHTML = '';

            return {
              element: element,
              lines: codeLines,
              lineHeights: [],
              oneLinerHeight: oneLinerHeight,
              sizer: lineNumberSizer,
            };
          }).filter(Boolean);

          infos.forEach(function (info) {
            var lineNumberSizer = info.sizer;
            var lines = info.lines;
            var lineHeights = info.lineHeights;
            var oneLinerHeight = info.oneLinerHeight;

            lineHeights[lines.length - 1] = undefined;
            lines.forEach(function (line, index) {
              if (line && line.length > 1) {
                var e = lineNumberSizer.appendChild(document.createElement('span'));
                e.style.display = 'block';
                e.textContent = line;
              } else {
                lineHeights[index] = oneLinerHeight;
              }
            });
          });

          infos.forEach(function (info) {
            var lineNumberSizer = info.sizer;
            var lineHeights = info.lineHeights;

            var childIndex = 0;
            for (var i = 0; i < lineHeights.length; i++) {
              if (lineHeights[i] === undefined) {
                lineHeights[i] = lineNumberSizer.children[childIndex++].getBoundingClientRect().height;
              }
            }
          });

          infos.forEach(function (info) {
            var lineNumberSizer = info.sizer;
            var wrapper = info.element.querySelector('.line-numbers-rows');

            lineNumberSizer.style.display = 'none';
            lineNumberSizer.innerHTML = '';

            info.lineHeights.forEach(function (height, lineNumber) {
              wrapper.children[lineNumber].style.height = height + 'px';
            });
          });
        }

        /**
         * Returns style declarations for the element
         *
         * @param {Element} element
         */
        function getStyles(element) {
          if (!element) {
            return null;
          }

          return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
        }

        var lastWidth = undefined;
        window.addEventListener('resize', function () {
          if (config.assumeViewportIndependence && lastWidth === window.innerWidth) {
            return;
          }
          lastWidth = window.innerWidth;

          resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.' + PLUGIN_NAME)));
        });

        Prism.hooks.add('complete', function (env) {
          if (!env.code) {
            return;
          }

          var code = /** @type {Element} */ (env.element);
          var pre = /** @type {HTMLElement} */ (code.parentNode);

          // works only for <code> wrapped inside <pre> (not inline)
          if (!pre || !/pre/i.test(pre.nodeName)) {
            return;
          }

          // Abort if line numbers already exists
          if (code.querySelector('.line-numbers-rows')) {
            return;
          }

          // only add line numbers if <code> or one of its ancestors has the `line-numbers` class
          if (!Prism.util.isActive(code, PLUGIN_NAME)) {
            return;
          }

          // Remove the class 'line-numbers' from the <code>
          code.classList.remove(PLUGIN_NAME);
          // Add the class 'line-numbers' to the <pre>
          pre.classList.add(PLUGIN_NAME);

          var match = env.code.match(NEW_LINE_EXP);
          var linesNum = match ? match.length + 1 : 1;
          var lineNumbersWrapper;

          var lines = new Array(linesNum + 1).join('<span></span>');

          lineNumbersWrapper = document.createElement('span');
          lineNumbersWrapper.setAttribute('aria-hidden', 'true');
          lineNumbersWrapper.className = 'line-numbers-rows';
          lineNumbersWrapper.innerHTML = lines;

          if (pre.hasAttribute('data-start')) {
            pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
          }

          env.element.appendChild(lineNumbersWrapper);

          resizeElements([pre]);

          Prism.hooks.run('line-numbers', env);
        });

        Prism.hooks.add('line-numbers', function (env) {
          env.plugins = env.plugins || {};
          env.plugins.lineNumbers = true;
        });



        var callbacks = [];
        var map = {};
        var noop = function () {};

        Prism.plugins.toolbar = {};

        /**
         * @typedef ButtonOptions
         * @property {string} text The text displayed.
         * @property {string} [url] The URL of the link which will be created.
         * @property {Function} [onClick] The event listener for the `click` event of the created button.
         * @property {string} [className] The class attribute to include with element.
         */

        /**
         * Register a button callback with the toolbar.
         *
         * @param {string} key
         * @param {ButtonOptions|Function} opts
         */
        var registerButton = Prism.plugins.toolbar.registerButton = function (key, opts) {
          var callback;

          if (typeof opts === 'function') {
            callback = opts;
          } else {
            callback = function (env) {
              var element;

              if (typeof opts.onClick === 'function') {
                element = document.createElement('button');
                element.type = 'button';
                element.addEventListener('click', function () {
                  opts.onClick.call(this, env);
                });
              } else if (typeof opts.url === 'string') {
                element = document.createElement('a');
                element.href = opts.url;
              } else {
                element = document.createElement('span');
              }

              if (opts.className) {
                element.classList.add(opts.className);
              }

              element.textContent = opts.text;

              return element;
            };
          }

          if (key in map) {
            console.warn('There is a button with the key "' + key + '" registered already.');
            return;
          }

          callbacks.push(map[key] = callback);
        };

        /**
         * Returns the callback order of the given element.
         *
         * @param {HTMLElement} element
         * @returns {string[] | undefined}
         */
        function getOrder(element) {
          while (element) {
            var order = element.getAttribute('data-toolbar-order');
            if (order != null) {
              order = order.trim();
              if (order.length) {
                return order.split(/\s*,\s*/g);
              } else {
                return [];
              }
            }
            element = element.parentElement;
          }
        }

        /**
         * Post-highlight Prism hook callback.
         *
         * @param env
         */
        var hook = Prism.plugins.toolbar.hook = function (env) {
          // Check if inline or actual code block (credit to line-numbers plugin)
          var pre = env.element.parentNode;
          if (!pre || !/pre/i.test(pre.nodeName)) {
            return;
          }

          // Autoloader rehighlights, so only do this once.
          if (pre.parentNode.classList.contains('code-toolbar')) {
            return;
          }

          // Create wrapper for <pre> to prevent scrolling toolbar with content
          var wrapper = document.createElement('div');
          wrapper.classList.add('code-toolbar');
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);

          // Setup the toolbar
          var toolbar = document.createElement('div');
          toolbar.classList.add('toolbar');

          // order callbacks
          var elementCallbacks = callbacks;
          var order = getOrder(env.element);
          if (order) {
            elementCallbacks = order.map(function (key) {
              return map[key] || noop;
            });
          }

          elementCallbacks.forEach(function (callback) {
            var element = callback(env);

            if (!element) {
              return;
            }

            var item = document.createElement('div');
            item.classList.add('toolbar-item');

            item.appendChild(element);
            toolbar.appendChild(item);
          });

          // Add our toolbar to the currently created wrapper of <pre> tag
          wrapper.appendChild(toolbar);
        };

        registerButton('label', function (env) {
          var pre = env.element.parentNode;
          if (!pre || !/pre/i.test(pre.nodeName)) {
            return;
          }

          if (!pre.hasAttribute('data-label')) {
            return;
          }

          var element; var template;
          var text = pre.getAttribute('data-label');
          try {
            // Any normal text will blow up this selector.
            template = document.querySelector('template#' + text);
          } catch (e) { /* noop */ }

          if (template) {
            element = template.content;
          } else {
            if (pre.hasAttribute('data-url')) {
              element = document.createElement('a');
              element.href = pre.getAttribute('data-url');
            } else {
              element = document.createElement('span');
            }

            element.textContent = text;
          }

          return element;
        });

        /**
         * Register the toolbar with Prism.
         */
        Prism.hooks.add('complete', hook);

        /**
         * When the given elements is clicked by the user, the given text will be copied to clipboard.
         *
         * @param {HTMLElement} element
         * @param {CopyInfo} copyInfo
         *
         * @typedef CopyInfo
         * @property {() => string} getText
         * @property {() => void} success
         * @property {(reason: unknown) => void} error
         */
        function registerClipboard(element, copyInfo) {
          element.addEventListener('click', function () {
            copyTextToClipboard(copyInfo);
          });
        }

        // https://stackoverflow.com/a/30810322/7595472

        /** @param {CopyInfo} copyInfo */
        function fallbackCopyTextToClipboard(copyInfo) {
          var textArea = document.createElement('textarea');
          textArea.value = copyInfo.getText();

          // Avoid scrolling to bottom
          textArea.style.top = '0';
          textArea.style.left = '0';
          textArea.style.position = 'fixed';

          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            var successful = document.execCommand('copy');
            setTimeout(function () {
              if (successful) {
                copyInfo.success();
              } else {
                copyInfo.error();
              }
            }, 1);
          } catch (err) {
            setTimeout(function () {
              copyInfo.error(err);
            }, 1);
          }

          document.body.removeChild(textArea);
        }
        /** @param {CopyInfo} copyInfo */
        function copyTextToClipboard(copyInfo) {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(copyInfo.getText()).then(copyInfo.success, function () {
              // try the fallback in case `writeText` didn't work
              fallbackCopyTextToClipboard(copyInfo);
            });
          } else {
            fallbackCopyTextToClipboard(copyInfo);
          }
        }

        /**
         * Selects the text content of the given element.
         *
         * @param {Element} element
         */
        function selectElementText(element) {
          // https://stackoverflow.com/a/20079910/7595472
          window.getSelection().selectAllChildren(element);
        }

        /**
         * Traverses up the DOM tree to find data attributes that override the default plugin settings.
         *
         * @param {Element} startElement An element to start from.
         * @returns {Settings} The plugin settings.
         * @typedef {Record<"copy" | "copy-error" | "copy-success" | "copy-timeout", string | number>} Settings
         */
        function getSettings(startElement) {
          /** @type {Settings} */
          var settings = {
            'copy': '<svg viewBox="0 0 115.77 122.88" xmlns="http://www.w3.org/2000/svg"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><path class="st0" d="m89.62 13.96v7.73h12.2v0.02c3.85 0.01 7.34 1.57 9.86 4.1 2.5 2.51 4.06 5.98 4.07 9.82h0.02v73.3h-0.02c-0.01 3.84-1.57 7.33-4.1 9.86-2.51 2.5-5.98 4.06-9.82 4.07v0.02h-61.73v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-16.43h-12.2v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-64.62h0.02c0.01-3.85 1.58-7.34 4.1-9.86 2.51-2.5 5.98-4.06 9.82-4.07v-0.02h61.73v0.02c3.85 0.01 7.34 1.57 9.86 4.1 2.5 2.51 4.06 5.98 4.07 9.82h0.02zm-10.58 7.73v-7.75h0.02c0-0.91-0.39-1.75-1.01-2.37-0.61-0.61-1.46-1-2.37-1v0.02h-61.73v-0.02c-0.91 0-1.75 0.39-2.37 1.01-0.61 0.61-1 1.46-1 2.37h0.02v64.62h-0.02c0 0.91 0.39 1.75 1.01 2.37 0.61 0.61 1.46 1 2.37 1v-0.02h12.2v-46.28h0.02c0.01-3.85 1.58-7.34 4.1-9.86 2.51-2.5 5.98-4.06 9.82-4.07v-0.02h0.02zm26.14 87.23v-73.29h0.02c0-0.91-0.39-1.75-1.01-2.37-0.61-0.61-1.46-1-2.37-1v0.02h-61.73v-0.02c-0.91 0-1.75 0.39-2.37 1.01-0.61 0.61-1 1.46-1 2.37h0.02v73.3h-0.02c0 0.91 0.39 1.75 1.01 2.37 0.61 0.61 1.46 1 2.37 1v-0.02h61.73v0.02c0.91 0 1.75-0.39 2.37-1.01 0.61-0.61 1-1.46 1-2.37h-0.02z"/></svg>',
            'copy-error': 'Press Ctrl+C to copy',
            'copy-success': '<svg viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg"><path d="m34.388 67.984c-0.286-0.308-0.542-0.638-0.762-0.981-0.221-0.345-0.414-0.714-0.573-1.097-0.531-1.265-0.675-2.631-0.451-3.934 0.224-1.294 0.812-2.531 1.744-3.548l0.34-0.35c2.293-2.185 5.771-2.592 8.499-0.951 0.39 0.233 0.762 0.51 1.109 0.827l0.034 0.031c1.931 1.852 5.198 4.881 7.343 6.79l1.841 1.651 22.532-23.635c0.317-0.327 0.666-0.62 1.035-0.876 0.378-0.261 0.775-0.482 1.185-0.661 0.414-0.181 0.852-0.323 1.3-0.421 0.447-0.099 0.903-0.155 1.356-0.165h0.026c0.451-5e-3 0.893 0.027 1.341 0.103 0.437 0.074 0.876 0.193 1.333 0.369 0.421 0.161 0.825 0.363 1.207 0.604 0.365 0.231 0.721 0.506 1.056 0.822l0.162 0.147c0.316 0.313 0.601 0.653 0.85 1.014 0.256 0.369 0.475 0.766 0.652 1.178 0.183 0.414 0.325 0.852 0.424 1.299 0.1 0.439 0.154 0.895 0.165 1.36v0.23c-4e-3 0.399-0.042 0.804-0.114 1.204-0.079 0.435-0.198 0.863-0.356 1.271-0.16 0.418-0.365 0.825-0.607 1.21-0.238 0.377-0.518 0.739-0.832 1.07l-27.219 28.56c-0.32 0.342-0.663 0.642-1.022 0.898-0.369 0.264-0.767 0.491-1.183 0.681-0.417 0.188-0.851 0.337-1.288 0.44-0.435 0.104-0.889 0.166-1.35 0.187l-0.125 3e-3c-0.423 9e-3 -0.84-0.016-1.241-0.078l-0.102-0.02c-0.415-0.07-0.819-0.174-1.205-0.31-0.421-0.15-0.833-0.343-1.226-0.575l-0.063-0.04c-0.371-0.224-0.717-0.477-1.032-0.754l-0.063-0.06c-1.58-1.466-3.297-2.958-5.033-4.466-3.007-2.613-7.178-6.382-9.678-9.02zm27.052-67.984c16.96 0 32.328 6.883 43.453 17.987 11.104 11.125 17.986 26.493 17.986 43.453 0 16.961-6.883 32.329-17.986 43.454-11.124 11.104-26.493 17.986-43.453 17.986-16.961 0-32.329-6.882-43.454-17.986-11.104-11.125-17.986-26.494-17.986-43.455 0-16.959 6.882-32.327 17.986-43.452 11.126-11.104 26.493-17.987 43.454-17.987zm35.459 25.981c-9.073-9.074-21.609-14.685-35.459-14.685-13.851 0-26.387 5.611-35.46 14.685-9.073 9.073-14.684 21.609-14.684 35.458 0 13.851 5.611 26.387 14.684 35.46s21.609 14.685 35.46 14.685c13.85 0 26.386-5.611 35.459-14.685s14.684-21.609 14.684-35.46c0-13.849-5.61-26.385-14.684-35.458z"/></svg>',
            'copy-timeout': 5000
          };

          var prefix = 'data-prismjs-';
          for (var key in settings) {
            var attr = prefix + key;
            var element = startElement;
            while (element && !element.hasAttribute(attr)) {
              element = element.parentElement;
            }
            if (element) {
              settings[key] = element.getAttribute(attr);
            }
          }
          return settings;
        }

        Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
          var element = env.element;

          var settings = getSettings(element);

          var linkCopy = document.createElement('button');
          linkCopy.className = 'copy-to-clipboard-button';
          linkCopy.setAttribute('type', 'button');
          var linkSpan = document.createElement('span');
          linkCopy.appendChild(linkSpan);

          setState('copy');

          registerClipboard(linkCopy, {
            getText: function () {
              return element.textContent;
            },
            success: function () {
              setState('copy-success');

              resetText();
            },
            error: function () {
              setState('copy-error');

              setTimeout(function () {
                selectElementText(element);
              }, 1);

              resetText();
            }
          });

          return linkCopy;

          function resetText() {
            setTimeout(function () { setState('copy'); }, settings['copy-timeout']);
          }

          /** @param {"copy" | "copy-error" | "copy-success"} state */
          function setState(state) {
            linkSpan.innerHTML = settings[state];
            linkCopy.setAttribute('data-copy-state', state);
          }
        });
    }
  },
  render() {
    const defaultSlot = this.$slots.default() || [];
    const code =
      defaultSlot && defaultSlot.length
        ? defaultSlot[0].children
        : '';
    const prismLanguage = Prism.languages[this.language];
    const formattedCode = Prism.highlight(code, prismLanguage);
    if (this.inline) {
      return h('code', {
        class: [this.class],
        innerHTML: formattedCode
      });
    }
    return h('div', { class: 'bg-gray-100 my-5 border-gray-300 dark:bg-zinc-900 dark:border-zinc-800 transition-colors border rounded-md', innerHTML: '<pre class="' + this.class + ' language-' + this.language + '"><code class="' + this.class + ' language-' + this.language + '">' + formattedCode + '</code></pre>' });
  },
  mounted() {
    Prism.highlightAll();
    this.addPrismPlugins();
  },
  updated() {
    Prism.highlightAll();
    this.addPrismPlugins();
  }
}
</script>

<style>
@import '../assets/prism.css';
</style>
