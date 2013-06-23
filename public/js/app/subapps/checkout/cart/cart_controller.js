App.module("Checkout.Cart", function (Cart, App, Backbone, Marionette, $, _){

  Cart.Controller = {
    showCart: function() {
      var func = _.bind(this._showItems, this);
      if(App.bootstrapItems){
        var cartItems = App.request("cart:items:entities", App.bootstrapItems);
      }else{
        var cartItems = App.request("cart:items:entities");
      }
          	
      $.when(cartItems).then(func);
    },
    _showItems: function(obj){
      if(App.bootstrapItems){
        // delete bootstrap models after loading them
        delete App.bootstrapItems; 
    	 var itemsView = new Cart.CollectionView({
        collection: obj.collection,
        el:'.thumbnails',
        attach: true
      });
      App.Checkout.layout.items.attachView(itemsView);
      }else{
        var itemsView = new Cart.CollectionView({collection: obj.collection});
      	App.Checkout.layout.items.show(itemsView);
      }
      this._bindEventHandlers(itemsView);
    },
    _bindEventHandlers: function(collectionView){
      collectionView.children.each(function(view){
        view.on('removeFromCart', function(){
          this.model.destroy();
        })
      })
    }
  };
  
})