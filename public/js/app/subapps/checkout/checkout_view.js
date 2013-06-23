App.module('Checkout', function (Checkout, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	Checkout.Layout = Backbone.Marionette.Layout.extend({
		initialize: function(){
			console.log('initializing Checkout layout');
			this.on('show', function(){
				App.main.$el.css({height:'auto'});

				// Simple way to handle check out event.
/*				this.$('.checkout').click(function(e){
					$.ajax({
						url: '/checkout',
						success: function(resObj){
							console.log(resObj);
						}
					})
				})*/
			});
		},
		template: function(model){
			return templatizer.includes.checkout_layout(model);
		},
		regions:{
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