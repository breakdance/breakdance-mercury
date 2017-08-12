
var mercury = require('../');
var auth = require('../tmp/key');
var opts = {url: 'http://download.java.net/jdk7u2/docs/technotes/tools/solaris/javadoc.html', token: auth.token};

mercury(opts)
  .then(function(res) {
    console.log(res.markdown);
  })
  .catch(console.error)
