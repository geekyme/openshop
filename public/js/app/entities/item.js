App.module("Entities", function (Entities, App, Backbone, Marionette, $, _){
	// for models and collections of the class Item
	var Item = Entities.Model.extend({
		defaults:{
			imgSrc: null,
			name: '',
			desc: '',
			expire: '',
			price: '',
			savings: '',
			category: ''
		}
	})

	var ItemCollection = Entities.Collection.extend({
		model: Item,
		url: '/api/all/items'
	})

	var API = {
		fetchCollection: function(arr, url){
			if(arr){
				console.log('bootstrapping items into collection');
				var itemCollection = new ItemCollection(arr);
				if(url != undefined){
					itemCollection.url = url;
				}
				return {collection: itemCollection};
			}else{
				console.log('fetching items from server');
				var deferred = $.Deferred();
				var itemCollection = new ItemCollection();
				if(url != undefined){
					itemCollection.url = url;
				}
				itemCollection.on('reset', function(collection){
					deferred.resolve({collection: collection});
				});	
				itemCollection.fetch();	
				return deferred.promise();	
			}
		},
		fetchItem: function(itemID, arr){
			if(arr){
				console.log('bootstrapping an item into collection');
				var itemCollection = new ItemCollection(arr);
				var item = itemCollection.get(itemID);
				item.urlRoot = '/api/all/items';
				return {collection: itemCollection, model: item};
			}else{
				console.log('fetching an item from server');
				var deferred = $.Deferred();
				var itemCollection = new ItemCollection();
				var item = new Item({id: itemID});
				item.urlRoot = '/api/all/items';
				item.on('sync', function(model){
					// return a collection with just 1 item
					itemCollection.add(model);
					deferred.resolve({collection: itemCollection, model: model});
				});
				item.fetch();
				return deferred.promise();
			}
		},	
		getAll: function(collection){
			return this.fetchCollection(collection);
		},	
		getCategoryItems: function(categoryName, arr){
			return this.fetchCollection(arr, '/api/categories/'+categoryName+'/items');
		},
		getUserItems: function(username, arr){
			return this.fetchCollection(arr, '/api/users/'+username+'/items');
		},
		getMyItems: function(arr){
			return this.fetchCollection(arr, '/api/me/items');
		},
		getItem: function(itemID, arr){
			return this.fetchItem(itemID, arr)
		},
		getNew: function(obj){
			var item = new Item(obj);
			item.urlRoot = '/api/all/items';
			return item;
		},
		getCartItems: function(arr){
			return this.fetchCollection(arr, '/api/cart/items');
		}
	};

	App.reqres.addHandler("new:items:entity", function (obj) {
		// will return the deferred object
		return API.getNew(obj);
	})

	App.reqres.addHandler("items:entities", function (collection) {
		// will return the deferred object
		return API.getAll(collection);
	})

	App.reqres.addHandler("category:items:entities", function (categoryName, arr) {
		// will return the deferred object
		return API.getCategoryItems(categoryName, arr);
	})

	App.reqres.addHandler("cart:items:entities", function (arr) {
		// will return the deferred object
		return API.getCartItems(arr);
	})

	App.reqres.addHandler("user:items:entities", function (username, arr) {
		// will return the deferred object
		return API.getUserItems(username, arr);
	})

	App.reqres.addHandler("mine:items:entities", function (arr) {
		// will return the deferred object
		return API.getMyItems(arr);
	})

	App.reqres.addHandler("items:entity", function (itemID, arr) {
		// will return the deferred object
		return API.getItem(itemID, arr);
	})
})