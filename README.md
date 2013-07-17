# Openshop
Openshop is an example Backbone Marionette w/ PushState + Node.js application. It is an e-commerce platform with the usual CRUD. 

The main purpose of building this app is to improve my own understanding of Backbone Marionette & Node.js, as well as help other developers understand how these two play well with each other. 

DEMO: http://shop.pin.gs/

Since search engines may have trouble accessing dynamic HTML rendered by backbone apps, I have implemented Push State together with Marionette & Node.js for SEO accessibility. I took reference from [this article](http://lostechies.com/derickbailey/2011/09/26/seo-and-accessibility-with-html5-pushstate-part-2-progressive-enhancement-with-backbone-js/) as a guide. The app has multiple entry points ('/', '/browse', '/browse/users/:username', etc) that retrieves an initial HTML from the server. After getting the initial HTML from the server, Progressive enhancement is then applied to bind backbone views, models, collections and events. The result is the same super-fast backbone app with content that is accessible by search engines.

## Developer Reference
* Styled with [Twitter Bootstrap](http://twitter.github.io/bootstrap/index.html) + [Google Bootstrap](http://todc.github.io/todc-bootstrap/)
* Powered by [Node.js](http://nodejs.org/), [Express](http://expressjs.com/) & [OrientDB](http://www.orientdb.org/) on the backend
* Powered by [Backbone Marionette](http://marionettejs.com/) on the frontend
* Sharing of Jade templates between server and client with [templatizer](https://github.com/HenrikJoreteg/templatizer) 
* RESTful API
* Push State + Progressive Enhancement
* Bootstrapping models in a javascript variable

## Instructions for cloning (tested in windows & linux)
Clone this repository
```
git clone https://github.com/geekyme/openshop.git
```
Navigate to it
```
cd openshop
```
Install all dependencies in package.json
```
npm install
```
**Fill in the credentials inside /config_example/**. When you are done, rename config_example to config. Then, run the app
```
node app.js
```

## Bugs
* when create is clicked, will add a input tag to the dom. not deleted when view is closed. This is due to the use of Dropzone.js
* items not stacking nicely on top of each other. Use masonry.
* when there's only 1 item left in the cart, it does not get removed.
* when items are requested from server, images are loaded twice! Check to see if I had accidentally render views twice.
* Items created by one user seem to be saved errorneously as items created by another user (lol, oops)
* Items created by one user seem to save multiple records? maybe the user click too many times. Put up notification to indicate item created. 
FOUND THE PROBLEM: A user who just joined is not being saved into his req.session.user. When he creates an item, this generates an error. (fb.js: 51, api.js: 16, item.js: 71). 
* Update item error:
Cannot UPDATE the record #14:1 because the version is not the latest. Probably you are updating an old record or it has been modified by another user (db=v11 your=v0)"


## Todo
* payment system & checkout ? (Tried with paypal-express & doesn't suit this)
* possible meetup at specified location using google map ?
* notification when an item is successfully updated, created, or deleted
* minification

## Credits
* Most of the images shown in this demo application are obtained in Google Images. I claim no credit for the images and I thank the original owners for it. 