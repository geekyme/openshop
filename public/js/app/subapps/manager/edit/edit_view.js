App.module("Manager.Edit", function (Edit, App, Backbone, Marionette, $, _){

	//individual item view
	Edit.SingleItemView = Marionette.ItemView.extend({
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
			return templatizer.includes.item_edit({item: model});
		},
		triggers:{
			'click .btn.delete':'delete',
			'click .btn.update': 'update',
		},
		onRender: function () {
	        // get rid of that pesky wrapping-div
	        // assumes 1 child element.
	        this.$el = this.$el.children();
	        this.setElement(this.$el);
      	}
	});

	Edit.NothingView = Backbone.Marionette.ItemView.extend({
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
	Edit.CollectionView = Marionette.CompositeView.extend({
		initialize: function(options){
			if(options.attach){
				this.attachChildren(options.collection);
			}
		},
		template: function(model){
			return templatizer.includes.items(model);
		},
		itemViewContainer: '.thumbnails',
		emptyView: Edit.NothingView,
		itemView: Edit.SingleItemView,
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
				var child = new Edit.SingleItemView({
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