App.module("Browse.Category", function (Category, App, Backbone, Marionette, $, _){

  Category.View = Marionette.ItemView.extend({
    template: function(collection){
      return templatizer.includes.categories({categories:collection});
    },
    onRender: function () {
      // get rid of that pesky wrapping-div
      // assumes 1 child element.
      this.$el = this.$el.children();
      this.setElement(this.$el);
    }
  })
})