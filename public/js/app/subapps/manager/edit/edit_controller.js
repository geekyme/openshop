App.module("Manager.Edit", function (Edit, App, Backbone, Marionette, $, _){

  Edit.Controller = {
    newEditView: function() {
      var func = _.bind(this._showEditView, this);
      if(App.bootstrapItems){
        // if bootstrap models exist, use it. dont need to fetch from server
        var myItems = App.request("mine:items:entities", App.bootstrapItems);
      }else{
        var myItems = App.request("mine:items:entities");        
      }
      $.when(myItems).then(func);
    },
    _showEditView: function(obj){
      if(App.bootstrapItems){
        // delete bootstrap models after loading them
        delete App.bootstrapItems;    
        // progressive enhancement -- attach to the DOM
        var itemsView = new Edit.CollectionView({
          collection: obj.collection, 
          el:'.thumbnails',
          attach: true
        });
        App.Manager.layout.main.attachView(itemsView);
      }else{
        var itemsView = new Edit.CollectionView({collection: obj.collection});
        App.Manager.layout.main.show(itemsView);
      }
      this._bindEventHandlers(itemsView);
    },
    _bindEventHandlers: function(collectionView){
      collectionView.children.each(function(view){
        view.on('delete', function(){
          console.log('delete: '+this.model.url());
          this.model.destroy();
        });

        view.on('update', function(){
          console.log('update: '+this.model.id);
          // Test sharing of methods between components of a module
          var updateView = App.Manager.Create.Controller._showCreateView(this.model);
        });
      });
    }
  };
  
})