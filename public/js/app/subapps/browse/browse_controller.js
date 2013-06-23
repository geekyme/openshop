App.module('Browse', function (Browse, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	var Router = Marionette.AppRouter.extend({
		before: function (){
			// before routing... do this. function called always before routing.
			App.startSubApp('Browse', {});
			Backbone.history.back = function(){
				s = window.location.hash || window.location.pathname;
				s = s.substr(1);
				return s;
			}();			
		},
		appRoutes: {
			"browse": "browseAll",
			"browse/categories/:categoryName": "browseCategory",
			"browse/users/:username": "browseUser",
			"browse/items/:itemID": "browseItem"
		}
	})

	var API = {
		browseAll : function (){
			Browse.Store.Controller.browseAll()
		},
		browseCategory: function(categoryName){
			Browse.Store.Controller.browseCategory(categoryName)
		},
		browseUser: function(username){
			Browse.Store.Controller.browseUser(username)
		},
		browseItem: function(itemID){
			Browse.Store.Controller.browseItem(itemID)
		}
	}

	App.addInitializer(function () {
      new Router({
        controller: API
      });

    });

    Browse.addInitializer(function() {
    	if(App.bootstrapItems){
    		// App.boostrapItems will be deleted later after item views are attached to current DOM and bootstrapped models
    		Browse.layout = new Browse.Layout({el:'#browse-layout'});
    		console.log('attaching browse layout');
    		App.main.attachView(Browse.layout);
    	}else{
	    	Browse.layout = new Browse.Layout();
	    	console.log('showing browse layout');
	    	App.main.show(Browse.layout);    		
    	}
		App.vent.trigger("app:started", "Browse");
		console.log('Browse started');
    });
})