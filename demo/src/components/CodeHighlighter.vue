<script>
import Prism from 'prismjs';

/**
 * Plugin name which is used as a class name for <pre> which is activating the plugin
 *
 * @type {string}
 */
var PLUGIN_NAME = 'line-numbers';

/**
 * Regular expression used for determining line breaks
 *
 * @type {RegExp}
 */
var NEW_LINE_EXP = /\n(?!$)/g;


/**
 * Global exports
 */
var config = Prism.plugins.lineNumbers = {
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
    'copy': 'Copy',
    'copy-error': 'Press Ctrl+C to copy',
    'copy-success': 'Copied!',
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
    linkSpan.textContent = settings[state];
    linkCopy.setAttribute('data-copy-state', state);
  }
});
</script>

<style>
@import '../assets/prism.css';
</style>
