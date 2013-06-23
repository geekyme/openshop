App.module('Home', function (Home, App, Backbone, Marionette, $, _){
	
	Home.View = Marionette.ItemView.extend({
		initialize: function(){
			this.on('show', function(){
				App.main.$el.css({height:'100%'});
			})	
		},
		template: function(model){
			return templatizer.includes.landing_page(model);
		},
	    onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
	    }
	});
})