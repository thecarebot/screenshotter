var express = require('express');
var lwip = require('lwip');
var phantom = require('phantom');
var app = express();

var port = process.env.PORT || 4432;

app.get('/api/image', function (req, res) {
  var sitepage = null;
  var phInstance = null;
  var buffer = null;

  var elId = req.query.id;
  var url = req.query.url;

  if (!elId || !url) {
    res.send('Parameters url and id are required');
    return;
  }

  console.log("Handling request for", elId, url);

  // Setup
  phantom.create()
  .then((instance) => {
    phInstance = instance;
    return instance.createPage();
  })

  .then((page) => {
    sitepage = page;
    return sitepage.property('viewportSize', {width: 1280, height: 1020});
  })

  // Set the viewport and open the page
  .then((page) => {
    return sitepage.open(url);
  })

  // Get the bounds of the page
  .then(function() {
    // We run `evaluateJavaScript` instead of `evaluate` because
    // there seems to be a bug passing local variables in to the page.
    return sitepage.evaluateJavaScript(
      'function() {return document.getElementById("' + elId + '").getBoundingClientRect(); }'
    );
  })

  // Using the bounds, clip the page
  .then(function(bounds) {
      console.log(bounds.top, bounds.right, bounds.bottom, bounds.left);

      return sitepage.property('clipRect', {
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      });
  })

  // Render the image
  .then(function() {
    return sitepage.renderBase64('PNG');
  })

  .then(function(buffer) {
    b = new Buffer(buffer, 'base64');

    res.writeHead({
      'Content-Type': 'image/png',
      'Content-Length': b.length
    });
    res.end(b);

    sitepage.close();
    phInstance.exit();
    return;
  })

  .catch((error) => {
    console.log(error);
    if (sitepage) {
      sitepage.close();
    }
    phInstance.exit();

    res.send(error);
  });
});

app.listen(port, function () {
  console.log('Example app listening on port', port);
});

