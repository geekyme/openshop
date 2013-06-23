App.module("Entities", function (Entities, App, Backbone, Marionette, $, _){
	// for models and collections of the class Item
	var Category = Entities.Model.extend({
		defaults:{
			imgSrc: null
		}
	})

	var CategoryCollection = Entities.Collection.extend({
		model: Category,
		url: '/api/all/categories'
	})

	var API = {
		fetchCollection: function(collection){
			if(collection){
				console.log('bootstrapping categories into collection');
				return new CategoryCollection(collection);
			}else{
				console.log('fetching categories from server');
				var deferred = $.Deferred();
				var categoryCollection = new CategoryCollection();
				categoryCollection.on('reset', function(collection){
					deferred.resolve(collection);
				});
				categoryCollection.fetch();
				return deferred.promise();
			}			
		},
		getAll: function(collection){
			return this.fetchCollection(collection);
		}
	};

	// listen for app.request
	App.reqres.addHandler("categories:entities", function (collection) {
		// will return the deferred object
		return API.getAll(collection);
	})
})