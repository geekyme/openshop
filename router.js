var site = require('./routes/site');
var api = require('./routes/api');
var FB = require('./helpers/fb');

module.exports = function(app){

	/* ==== MAIN SITE ROUTES ==== */
	app.get('/', site.home);
	app.get('/browse', site.browse);
	app.get('/browse/items/:itemID', site.browseItemDetail);
	app.get('/browse/categories/:category', site.browseCategory);
	app.get('/browse/users/:username', site.browseUser);
	app.get('/checkout', site.checkout);
	app.get('/manager', site.itemManager);
	app.get('/manager/edit', site.itemManager);
	app.get('/manager/create', site.itemManagerCreate);

	// For Facebook integration
	app.get('/login/callback', FB.loginCallback);

	// Session logout
	app.get('/logout', site.logout);
	/* ======================================================== */

	/* ==== API METHODS ==== */

	// CRUD item
	app.post('/api/all/items', api.createItem);
	app.get('/api/all/items/:itemID', api.getItem);
	app.delete('/api/me/items/:itemID', api.deleteItem);
	app.delete('/api/cart/items/:itemID', api.deleteCartItem);
	app.put('/api/me/items/:itemID', api.updateItem);
	
	// R items
	app.get('/api/all/items', api.getAllItems);
	app.get('/api/users/:username/items', api.getUserItems);
	app.get('/api/categories/:category/items', api.getCategoryItems);
	app.get('/api/me/items', api.getMyItems);
	app.get('/api/cart/items', api.getCartItems);

	// Helper routes
	app.get('/api/all/categories', api.getAllCategories);
	
	// Iteraction with items
	app.post('/api/all/items/:itemID/like', api.likeItem);
	app.post('/api/all/items/:itemID/unlike', api.unlikeItem);
	app.post('/api/all/items/:itemID/addToCart', api.addToCart);

	// Uploads
	app.post('/pictures/upload', api.uploadPic);

	/* ========================================================= */

}

