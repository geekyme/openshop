App.module('Checkout', function (Checkout, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	var Router = Marionette.AppRouter.extend({
		before: function (){
			// before routing... do this. function called always before routing.
			App.startSubApp('Checkout', {});
			Backbone.history.back = function(){
				s = window.location.hash || window.location.pathname;
				s = s.substr(1);
				return s;
			}();			
		},
		appRoutes: {
			"checkout":"showCart"
		}
	})

	var API = {
		showCart: function(){
			Checkout.Cart.Controller.showCart()
		}
	}

	App.addInitializer(function () {
      new Router({
        controller: API
      });

    });

    Checkout.addInitializer(function() {
    	if(App.bootstrapItems){
    		Checkout.layout = new Checkout.Layout({el: '#checkout-layout'});
    		console.log('attaching checkout layout');
    		App.main.attachView(Checkout.layout);
    	}else{
    		Checkout.layout = new Checkout.Layout();
    		console.log('showing checkout layout');
    		App.main.show(Checkout.layout);
    	}
    	
		App.vent.trigger("app:started", "Checkout");
		console.log('Checkout started');
    });
})