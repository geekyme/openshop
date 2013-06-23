App.module('Browse', function (Browse, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	Browse.Layout = Backbone.Marionette.Layout.extend({
		initialize: function(){
			console.log('initializing browse layout');
			this.on('show', function(){
				App.main.$el.css({height:'auto'});
			})	
		},
		template: function(model){
			return templatizer.includes.browse_layout(model);
		},
		regions:{
			categories:"#shop-category",
			items:"#item-container" 
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	});

})