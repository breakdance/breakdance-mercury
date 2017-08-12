'use strict';

var request = require('breakdance-request');
var merge = require('mixin-deep');
var pkg = require('./package');
var defaults = {
  headers: {},
  token: 'DhoyNaRL4bUIXE4nSa6DIJamMgD0Gnd4XvfiyvYn'
};

/**
 * The main export is a function that takes a `url` and `options`,
 * and returns a promise. See [breakdance](http://breakdance.io)
 * for documentation and all available options.
 *
 * ```js
 * mercury('http://breakdance.io/plugins.html')
 *   .then(function(res) {
 *     console.log(res.markdown);
 *   });
 * ```
 * @param {String} `url` The url of the HTML file to convert to markdown using [breakdance](http://breakdance.io)
 * @param {Object} `options` Options to pass to [breakdance](http://breakdance.io)
 * @return {Promise}
 * @api public
 */

function mercury(url, options) {
  if (typeof url === 'undefined') {
    return Promise.reject('expected a string or object');
  }

  return request(createOptions(url, options));
}

/**
 * Convert multiple HTML files to markdown by passing a base `url`
 * and an array of `paths`.
 *
 * ```js
 * mercury.reduce('http://breakdance.io/', ['docs.html', 'plugins.html'])
 *   .then(function(urls) {
 *     urls.forEach((res) => console.log(res.md));
 *   });
 * ```
 * @param {String} `url` The base url to use.
 * @param {String} `paths` One or more paths to concatenate to the base `url`.
 * @param {Object} `options` Options to pass to [breakdance](http://breakdance.io)
 * @return {Promise}
 * @api public
 */

mercury.reduce = function(url, pages, options) {
  if (typeof url === 'undefined') {
    return Promise.reject('expected a string or object');
  }

  if (!Array.isArray(pages)) {
    options = pages;
    pages = [];
  }

  if (options && options.domain) {
    options.url = options.domain;
  }

  return request.reduce(createOptions(url, options), pages);
};

function createOptions(url, options) {
  if (typeof url !== 'string') {
    options = url || {};
    url = null;
  }
  var opts = Object.assign({url: url}, options);
  opts.headers = mercury.normalizeHeaders(opts);
  opts.url = 'https://mercury.postlight.com/parser?url=' + (opts.url || options.domain);
  return opts;
}

mercury.normalizeHeaders = function(options) {
  var opts = merge(defaults, options);
  var token = opts.token || opts['x-api-key'] || opts.headers['x-api-key'];
  if (!isString(token)) {
    throw new TypeError('expected "options.token" to be a mercury x-api-key token');
  }
  opts.headers['user-agent'] = `${pkg.name}/${pkg.version} (${pkg.homepage})`;
  opts.headers['Content-Type'] = 'application/json';
  opts.headers['x-api-key'] = token;
  return opts.headers;
};

function isString(str) {
  return str && typeof str === 'string';
}

// function mercury(options, cb) {
//   var opts = Object.assign({}, options);
//   opts.headers = normalizeHeaders(opts);
//   opts.url = 'https://mercury.postlight.com/parser?url=' + opts.url;

//   get.concat(opts, function(err, stream, buf) {
//     if (err) {
//       if (stream && stream.statusCode === 204) {
//         cb(null, stream, '');
//         return;
//       }
//       cb(err);
//       return;
//     }

//     ok('received webpage');
//     var str = buf.toString();
//     var json = {content: str};
//     try {
//       json = JSON.parse(str);
//       ok('parsed response');
//     } catch (err) {
//       if (!/Unexpected token/.test(err.message)) {
//         cb(err);
//         return;
//       }
//     }

//     var markdown = breakdance(json.content, argv);
//     ok('converted to markdown');

//     cb(null, markdown, str);
//   });
// }

// var opts = {url: 'http://jekyllrb.com/docs/variables/', token: auth.token};
// // var opts = {url: 'http://breakdance.io/index.html', token: auth.token};
// // var opts = {url: 'http://download.java.net/jdk7u2/docs/technotes/tools/solaris/javadoc.html', token: auth.token};

// mercury(opts, function(err, str) {
//   if (err) return console.log(err);
//   console.log(str);
// });

/**
 * Expose `mercury`
 */

module.exports = mercury;
