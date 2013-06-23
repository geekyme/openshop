App.module('Manager', function (Manager, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	Manager.Layout = Backbone.Marionette.Layout.extend({
		initialize: function(){
			console.log('initializing manager layout');
			this.on('show', function(){
				App.main.$el.css({height:'auto'});
			})	
		},
		template: function(model){
			return templatizer.includes.manager_layout(model);
		},
		regions:{
			actions:"#actions",
			main: "#main"
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	});


})