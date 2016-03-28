var lwip = require('lwip');
var phantom = require('phantom');
// var page = require('webpage').create();

function process(error, image) {
  if (error) {
    console.log(error);
  }
}

var sitepage = null;
var phInstance = null;
phantom.create()
    .then((instance) => {
        phInstance = instance;
        return instance.createPage();
    })
    .then((page) => {
        sitepage = page;
        page.viewportSize = {
          width: 1280,
          height: 1020
        };
        return page.open('http://www.npr.org/2016/03/28/470522433/welcome-to-rent-court-where-tenants-can-face-a-tenuous-fate');
        // return page.open('http://google.com');
    })
    .then((status) => {
      sitepage.evaluate(function() {
        // return document.documentElement.scrollTop;
        document.body.style.width = 1280 + "px";
        document.getElementById("storytext").style.border = "5px solid red";
        var bounds = document.getElementById("storytext").getBoundingClientRect();
        console.log(bounds.right, bounds.top);
        // document.body.style.height = h + "px";
        return;
      })
      .then(function() {
        sitepage.evaluate(function() {
            return document.getElementById("storytext").getBoundingClientRect();
        })
        .then(function(bounds) {
        console.log(bounds.top, bounds.left, bounds.bottom, bounds.right);

        sitepage.renderBase64('PNG')
        .then(function(buffer) {
          console.log(typeof buffer);
          var b = new Buffer(buffer, 'base64');
          lwip.open(b, 'png', function(error, image) {
            if (error) {
              console.log(error);
              return;
            }
            //image.crop(Math.round(bounds.left), Math.round(bounds.top), Math.round(bounds.right), Math.round(bounds.bottom), function(error, image) {
            //  console.log("Did I crop?", error);
              image.writeFile('test.png', function(error) {
                console.log("Did I save?", error);
              });
            //});
          });

          sitepage.close();
          phInstance.exit();
          return;
        })
        .catch(function(error) {
          console.log("Error getting bounds", error);
          sitepage.close();
          phInstance.exit();
        });
      });
      });
    })
    .catch((error) => {
      console.log(error);
      phInstance.exit();
    });

