App.module("Browse.Store", function (Store, App, Backbone, Marionette, $, _){

  Store.Controller = {
    browseAll: function() {
      var func = _.bind(this._showItems, this);
      if(App.bootstrapItems){
        // if bootstrap models exist, use it. dont need to fetch from server
        var allItems = App.request("items:entities", App.bootstrapItems);            
      }else{
        var allItems = App.request("items:entities");        
      }
      $.when(allItems).then(func); 
    },
    browseCategory: function(categoryName) {
    	var func = _.bind(this._showItems, this);
      if(App.bootstrapItems){
        // if bootstrap models exist, use it. dont need to fetch from server
        var categoryItems = App.request("category:items:entities", categoryName, App.bootstrapItems);            
      }else{
        var categoryItems = App.request("category:items:entities", categoryName);        
      }
      $.when(categoryItems).then(func); 
    },
    browseUser: function(username) {
    	var func = _.bind(this._showItems, this);
      if(App.bootstrapItems){
        // if bootstrap models exist, use it. dont need to fetch from server
        var categoryItems = App.request("user:items:entities", username, App.bootstrapItems);            
      }else{
        var categoryItems = App.request("user:items:entities", username);        
      }
      $.when(categoryItems).then(func); 
    },
    browseItem: function(itemID) {
    	var func = _.bind(this._showItems, this);
      if(App.bootstrapItems){
        var item = App.request("items:entity", itemID, App.bootstrapItems);
      }else{
        var item = App.request("items:entity", itemID);
      }
      $.when(item).then(func);
    },
    _showItems: function(obj){
      if(App.bootstrapItems){
        // delete bootstrap models after loading them
        delete App.bootstrapItems;    
        // progressive enhancement -- attach to the DOM
        var itemsView = new Store.CollectionView({
          collection: obj.collection, 
          el:'.thumbnails',
          attach: true
        });
        App.Browse.layout.items.attachView(itemsView);
      }else{
        var itemsView = new Store.CollectionView({collection: obj.collection});
        App.Browse.layout.items.show(itemsView);   

      }

      this._bindEventHandlers(itemsView);
    	if(obj.model){
    		var view = itemsView.children.findByModel(obj.model);
    		view.showDetailed();
    	}
    },
    _bindEventHandlers: function(collectionView){
      collectionView.children.each(function(view){

        view.on('like', function(e){
          e.preventDefault();
          var self = this;
          var liked = this.$('button').hasClass('active');      
          var action = liked ? 'unlike' : 'like';
          
          $.ajax({
            type:'post',
            url:'/api/all/items/'+this.model.id+'/'+action,
            data:{
              _csrf: window.Backbone.CSRFToken
            },
            success: function(){
              console.log('ok');
              self.$el.find('button').toggleClass('active')
            }
          })
        });

        view.on('showDetailed', function(e){
          if(e) e.preventDefault();
          var itemDetailedView = new Store.SingleItemDetailedView({model: this.model});
          App.modal.show(itemDetailedView);
        });

        view.on('addToCart', function(){
          var self = this;
          console.log(self.model.id);
          console.log('add to cart');
          $.ajax({
            type:'post',
            url: '/api/all/items/'+self.model.id+'/addToCart',
            data: {
              _csrf: window.Backbone.CSRFToken,
              item: this.model.attributes
            }
          })
        })

      });      
    }
  };
  
})