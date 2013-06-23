App.module("Browse.Category", function (Category, App, Backbone, Marionette, $, _){

  Category.Controller = {
    getCategories: function (){
      // Communicates with another part of the app infrastructure to get data. Will temporarily return a deferred object 
      var categories = App.request("categories:entities", App.bootstrapCategories);
      var func = _.bind(this._showCategories, this);
      // once that deferred object is resolved, execute the function
      $.when(categories).then(func);
    },
    _showCategories: function (arr){
      if($('.categories').length != 0){
        // categories is already present in existing DOM, attach it
        var categoryView = new Category.View({model: arr, el: '.categories'});
        App.Browse.layout.categories.attachView(categoryView);
      }else{
        // categories not present, show it
        var categoryView = new Category.View({model: arr})
        App.Browse.layout.categories.show(categoryView);        
      }
    }
  }

  App.vent.on("app:started", function(appName) {
    if (appName === "Browse") {
        Category.Controller.getCategories();
    }
  });

})