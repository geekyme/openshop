App.module('Home', function (Home, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	// router definition
	var Router = Marionette.AppRouter.extend({
		before: function (){
			// before routing... do this. function called always before routing.
			App.startSubApp('Home', {});
			Backbone.history.back = function(){
				s = window.location.hash || window.location.pathname;
				s = s.substr(1);
				return s;
			}();			
		},
		appRoutes: {
			"":"home",
			"*404":"home"
		}
	})

	// controller for the router, contains all the route handlers
	var API = {

		home: function(route){
			if(route) return console.log('404 page: '+route);
			// look for the landing page view
			if($('.landing').length != 0){
				// progressive enhancement, DOM element exist so bind view to it
				App.main.attachView(new Home.View({el:'.landing'}));
			}else{
				App.main.show(new Home.View);
			}
		}
	}

	App.addInitializer(function () {
		// initialize a new Router to handle the routes in this sub app after the parent 'App' is started
      new Router({
        controller: API
      });

    });

	// message to show that this sub app successfully started
    Home.addInitializer(function(options) {
		App.vent.trigger("app:started", "Home");
		console.log('Home started');
    });
})