var lwip = require('lwip');
var phantom = require('phantom');
// var page = require('webpage').create();

function process(error, image) {
  if (error) {
    console.log(error);
  }
}

var elId = 'storytext';
//id = 'main';
var url = 'http://www.npr.org/2016/03/28/470522433/welcome-to-rent-court-where-tenants-can-face-a-tenuous-fate';
// url = 'http://thecarebot.github.io';
var sitepage = null;
var phInstance = null;
var buffer = null;

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

  // Crop and save the images
  lwip.open(b, 'png', function(error, image) {
    if (error) {
      console.log("Error opening image", error);
      return;
    }
    image.writeFile('test.png', function(error) {
      if (error) {
        console.log("Error saving image", error);
      }
    });
    sitepage.close();
    phInstance.exit();
    return;
  });
})

.catch((error) => {
  console.log(error);
  if (sitepage) {
    sitepage.close();
  }
  phInstance.exit();
});

