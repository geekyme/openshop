// Sub modules & Packages
var Item = require('../models/item');
var Category = require('../models/category');
var FB = require("fb");
var async = require('async');

/* MAIN SITE ROUTES */

// GET /
exports.home = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		res.render('site/home', {user: user, loginUrl: loginUrl });
	}
  
};

// GET /browse
exports.browse = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		async.parallel({
			items: function(callback){
				Item.getAll(5000, callback);
			}, 
			categories: function(callback){
				Category.getAll(5000, callback);
			}
		}, 
		function(err, results){
			if(err) return next(err);
			res.render('site/browse', {
				user: user, 
				loginUrl: loginUrl,
				categories: results.categories,
				items: results.items, 
			});
		})		
	}
  
};

// GET /browse/categories/:category
exports.browseCategory = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		async.parallel({
			items: function(callback){
				Item.getAllFromCategory(5000, req.params.category, callback)
			}, 
			categories: function(callback){
				Category.getAll(5000, callback);
			}
		}, 
		function(err, results){
			if(err) return next(err);
			res.render('site/browse', {
				user: user, 
				loginUrl: loginUrl,
				categories: results.categories,
				items: results.items, 
			});
		})		
	}
  
};

// GET /browse/users/:username
exports.browseUser = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		async.parallel({
			items: function(callback){
				Item.getUserItems(5000, req.params.username, callback)
			}, 
			categories: function(callback){
				Category.getAll(5000, callback);
			}
		}, 
		function(err, results){
			if(err) return next(err);
			res.render('site/browse', {
				user: user, 
				loginUrl: loginUrl,
				categories: results.categories,
				items: results.items, 
			});
		})		
	}
  
};

// GET/browse/items/:itemID
exports.browseItemDetail = function(req, res, next){
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		async.parallel({
			items: function(callback){
				Item.getOne(req.params.itemID, callback)
			}, 
			categories: function(callback){
				Category.getAll(5000, callback);
			}
		}, 
		function(err, results){
			if(err) return next(err);
			res.render('site/browse', {
				user: user, 
				loginUrl: loginUrl,
				categories: results.categories,
				items: results.items, 
			});
		})
	}	
}

// GET /cart
exports.checkout = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		var cart = req.session.cart || [];
		res.render('site/checkout', {
			user: user, 
			loginUrl: loginUrl,
			items: cart, 
		});
	}
  
};

// GET /manager, /manager/edit
exports.itemManager = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		Item.getUserItems(5000, user.username, function(err, result){
			if(err) return next(err);
			res.render('site/manager', {
				user: user, 
				loginUrl: loginUrl,
				items: result, 
			});
		})	
	}
  
};

// GET /manager/create
exports.itemManagerCreate = function(req, res, next) {
	var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
	var user = req.session.user;
	if(user && !req.session.access_token){
		console.log('getting access token');
		res.redirect(loginUrl);
	}else{
		console.log('rendering page');
		var item = {
			imgSrc: null,
			name: '',
			desc: '',
			expire: '',
			price: '',
			savings: '',
			category: ''			
		}
		async.parallel({
			categories: function(callback){
				Category.getAll(5000, callback);
			}
		}, 
		function(err, results){
			if(err) return next(err);
			item.categories = results.categories
			res.render('site/managerCreate', {
				user: user, 
				loginUrl: loginUrl,
				item: item, 
			});
		});
	}
  
};



// GET /logout
exports.logout = function(req, res, next){
	req.session.destroy(function(e){ res.redirect('/'); });
};

exports.error = function(req, res, next){
	var err = new Error('Test Error handler');
	next(err);
};