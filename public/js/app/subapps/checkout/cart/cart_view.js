App.module("Checkout.Cart", function (Cart, App, Backbone, Marionette, $, _){

	//individual item view
	Cart.SingleItemView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.on('render', function(){
				this.$("img.lazy").lazyload({effect: 'fadeIn'});
			});
			this.model.on('change', function(){
				this.render();
				$(window).resize();
			}, this);
		},
		template: function(model){
			return templatizer.includes.item_cart({item: model});
		},
		triggers:{
			'click .btn.remove': 'removeFromCart'
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	});

	Cart.NothingView = Backbone.Marionette.ItemView.extend({
		initialize: function(){
			this.on('render', function(){
				this.$("img.lazy").lazyload({effect: 'fadeIn'});
			});
		},
		template: function(model){
			return templatizer.includes.no_item(model);
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	})

	//collection of items view
	// Note: Marionette with automatically create the views with add / remove methods.
	Cart.CollectionView = Backbone.Marionette.CompositeView.extend({
		initialize: function(options){
			if(options.attach){
				this.attachChildren(options.collection);
			}
		},
		template: function(model){
			return templatizer.includes.items(model);
		},
		itemViewContainer: ".thumbnails",
		emptyView: Cart.NothingView,
		itemView: Cart.SingleItemView,
		onCompositeRendered: function(){
			console.log('finish rendering items');
			// hack for lazy load
			setTimeout(function(){$(window).resize();}, 1);
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	},
    	attachChildren: function(collection){
			var self = this;
			this.$('li').each(function(i, element){
				var child = new Cart.SingleItemView({
					el: element,
					model: collection.at(i)
				});
				self.children.add(child);
				// trigger the render event on the child so that the lazyload can be initialized
				child.trigger('render');
			})
			console.log('finishing attaching items');
		}
	})	
  
})