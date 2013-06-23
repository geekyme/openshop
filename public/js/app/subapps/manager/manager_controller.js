App.module('Manager', function (Manager, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	var Router = Marionette.AppRouter.extend({
		before: function (){
			// before routing... do this. function called always before routing.
			App.startSubApp('Manager', {});
			Backbone.history.back = function(){
				s = window.location.hash || window.location.pathname;
				s = s.substr(1);
				return s;
			}();			
		},
		appRoutes: {
			"manager":"edit",
			"manager/create": "create",
			"manager/edit": "edit",

		}
	})

	var API = {
		create: function(){
			Manager.Create.Controller.newCreateView();
		},
		edit: function(){
			Manager.Edit.Controller.newEditView();
		}
	}

	App.addInitializer(function () {
      new Router({
        controller: API
      });

    });

    Manager.addInitializer(function() {
    	if(App.bootstrapItems){
    		Manager.layout = new Manager.Layout({el: '#manager-layout'});
    		console.log('attaching manager layout');
    		App.main.attachView(Manager.layout);
    	}else{
    		Manager.layout = new Manager.Layout()
    		console.log('showing browse layout');
    		App.main.show(Manager.layout);  
    	}
		App.vent.trigger("app:started", "Manager");
		console.log('Manager started');
    });
})