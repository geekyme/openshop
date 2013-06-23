App.module("Browse.Store", function (Store, App, Backbone, Marionette, $, _){

	//individual item view
	Store.SingleItemView = Backbone.Marionette.ItemView.extend({
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
			return templatizer.includes.item_browse({item:model});
		},
		triggers:{
			'click .btn.addToCart': 'addToCart'
		},
		events:{
			'click .btn.like':'like',
			'click .btn.more': 'showDetailed'
		},
		like: function(e){
			this.trigger('like', e);
		},
		showDetailed: function(e){
			this.trigger('showDetailed',e);
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	});

	Store.SingleItemDetailedView = Backbone.Marionette.ItemView.extend({
		template: function(model){
			return templatizer.includes.modals.item_detail(model)
		},
		onRender: function () {
	      // get rid of that pesky wrapping-div
	      // assumes 1 child element.
	      this.$el = this.$el.children();
	      this.setElement(this.$el);
    	}
	
	});

	Store.NothingView = Backbone.Marionette.ItemView.extend({
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
	Store.CollectionView = Backbone.Marionette.CompositeView.extend({
		initialize: function(options){
			if(options.attach){
				this.attachChildren(options.collection);
			}
		},
		template: function(model){
			return templatizer.includes.items(model);
		},
		itemViewContainer: '.thumbnails',
		emptyView: Store.NothingView,
		itemView: Store.SingleItemView,
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
				var child = new Store.SingleItemView({
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