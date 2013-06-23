// Sub modules & Packages
var Item = require('../models/item');
var Category = require('../models/category');
var fs = require('fs');
var FB = require("fb");
var async = require('async');
var _ = require('underscore')

/* API METHODS */

// CRUD ITEMS //
// POST /api/all/items
exports.createItem = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.create(user, req.body, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}
	
}

// GET /api/all/items/:itemID
exports.getItem = function(req,res,next){
	Item.getOne(req.params.itemID, function(err, result){
		if(err) return next(err);
		res.send(200, result);
	})
}

// DELETE /api/all/items/:itemID
exports.deleteItem = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.delete(req.params.itemID, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}
}

// DELETE /api/cart/items/:itemID
exports.deleteCartItem = function(req,res,next){
	req.session.cart = _.reject(req.session.cart, function(item){ return item.id == req.params.itemID});
	res.send(200);
}

// PUT /api/all/items/:itemID
exports.updateItem = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.update(req.body, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}	
}

// READING COLLECTION OF ITEMS //

// GET /api/all/items
exports.getAllItems = function(req,res,next){
	Item.getAll(5000, function(err, result){
		if(err) return next(err);
		res.send(200, result);
	})
}

// GET /api/users/:username/items
exports.getUserItems = function(req,res,next){
	Item.getUserItems(5000, req.params.username, function(err, result){
		if(err) return next(err);
		res.send(200, result);
	})		
}

// GET /api/categories/:category/items
exports.getCategoryItems = function(req,res,next){
	Item.getAllFromCategory(5000, req.params.category, function(err, result){
		if(err) return next(err);
		res.send(200, result);
	})
}

// GET /api/me/items
exports.getMyItems = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.getUserItems(5000, user.username, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}
	
}

// CATEGORIES // 

// GET /api/all/categories
exports.getAllCategories = function(req,res,next){
	Category.getAll(5000, function(err, result){
		if(err) return next(err);
		res.send(200, result);
	})
}

exports.getCartItems = function(req,res,next){
	var cart = req.session.cart || [];
	res.json(cart);
}

// ITEM INTERACTION //

// POST /api/all/items/:itemID/like
exports.likeItem = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.like(user, req.params.itemID, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}
	
}

// POST /api/all/items/:itemID/unlike
exports.unlikeItem = function(req,res,next){
	var user = req.session.user
	if(user){
		Item.unlike(user, req.params.itemID, function(err, result){
			if(err) return next(err);
			res.send(200, result);
		})
	}else{
		res.send(400, 'Not logged in');
	}
	
}

// POST /api/all/items/:itemID/addToCart

exports.addToCart = function(req,res,next){
	if(req.session.cart === undefined){
		req.session.cart = [];
	}
	req.session.cart.push(req.body.item);
	console.log(req.session.cart.length);
	res.send(200);
}

// POST /pictures/upload
exports.uploadPic = function(req,res,next){
	var user = req.session.user
	if(user){
		fs.readFile(req.files.itemImage.path, function (err, data) {
			var oldName = req.files.itemImage.name;
			var newName = oldName.replace('/\s+/g','-').toLowerCase();
		  var newPath = __dirname + "/../public/img/uploads/"+newName;
		  fs.writeFile(newPath, data, function (err) {
		    if(err) return next(err);
		    res.send(200, newName);
		  });
		});
	}else{
		res.send(400, 'Not logged in');
	}
}