# Simple screenshotter app

Give it a URL and an element ID. It'll fetch the page, make a screenshot, and
crop it to just that element.

## Using

Make a request to `/api/image`. Specify a `url` parameter. If you add an
optional `id`, the image will be cropped to that element.

## Sample request

[http://localhost:4432/api/image?id=storytext&url=http://www.npr.org/2016/03/28/470522433/welcome-to-rent-court-where-tenants-can-face-a-tenuous-fate](http://localhost:4432/api/image?id=storytext&url=http://www.npr.org/2016/03/28/470522433/welcome-to-rent-court-where-tenants-can-face-a-tenuous-fate)

## Install

`npm install`

## Run

`node index.js`

## Deploy

This works out of the box on heroku. Create a new app and deploy the code as
usual:

`git push heroku master`

