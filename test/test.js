'use strict';

require('mocha');
var assert = require('assert');
var mercury = require('..');

describe('breakdance-mercury', function() {
  it('should export a function', function() {
    assert.equal(typeof mercury, 'function');
  });

  it('should expose a .reduce method', function() {
    assert.equal(typeof mercury.reduce, 'function');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    mercury()
      .catch(function(err) {
        assert(err);
        cb();
      });
  });

  it('should get html from a URL', function() {
    this.timeout(10000);

    return mercury('https://www.google.com/')
      .then(function(res) {
        assert(res);
        assert(res.json);
        assert.equal(res.json.title, 'Google');
      });
  });

  it('should convert html to markdown', function() {
    this.timeout(10000);

    return mercury('http://breakdance.io/plugins.html')
      .then(function(res) {
        assert(res);
        assert.equal(res.url, 'https://mercury.postlight.com/parser?url=http://breakdance.io/plugins.html');
        assert.equal(typeof res.markdown, 'string');
        assert(res.markdown.length > 1);
      });
  });

  it('should reduce multiple urls', function() {
    this.timeout(10000);

    var paths = ['plugins.html', 'docs.html']

    return mercury.reduce({domain: 'http://breakdance.io/'}, paths)
      .then(function(urls) {
        assert(urls[0]);
        assert.equal(urls[0].url, 'http://breakdance.io/plugins.html');
        assert.equal(typeof urls[0].markdown, 'string');
        assert(urls[0].markdown.length > 1);

        assert(urls[1]);
        assert.equal(urls[1].url, 'http://breakdance.io/docs.html');
        assert.equal(typeof urls[1].markdown, 'string');
        assert(urls[1].markdown.length > 1);
      });
  });
});
