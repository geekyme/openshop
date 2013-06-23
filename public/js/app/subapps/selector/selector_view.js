App.module("Selector", function (Selector, App, Backbone, Marionette, $, _) {

  Selector.View = Marionette.ItemView.extend({
    // attach this view to the existing element in the DOM
    el: "#app",
    // bind events to that element and its children
    events: {
      // for compatibility with pushstate
      'click a:not([data-bypass])': 'appSelected'
    },
    // event handlers to be triggered by a/m events
    appSelected: function(e){
      // bubble upwards to the controller to handle logic
      this.trigger("app:selected", e);
      
    }
  });

});