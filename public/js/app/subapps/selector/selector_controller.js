// Define module 'Selector' under parent App.
// The module, it's parent, backbone, marionette, jquery and underscore will be passed as arguments
App.module("Selector", function (Selector, App, Backbone, Marionette, $, _) {
  
  // make sure this module has to be manually started
  this.startWithParent = false;

  // create a controller object under this module to hold glue code
  Selector.Controller = Marionette.Controller.extend({
    initialize: function(){
      console.log('app selector started');
      this.showAppSelector();
    },
    showAppSelector: function() {
      // view automatically bound to DOM on initialize, no need to use .show
      this.selectorView = new Selector.View();
      this.selectorView.on("app:selected", this.routeToSubApp);
    },
    routeToSubApp: function(e){
      // this portion is for pushState purposes
      var $link = $(e.target);
      var $linkContainer = $link.parent();
      // highlight the sub app in the menu, and remove the highlight on others
      $linkContainer.addClass('active');
      $linkContainer.siblings().removeClass('active');
      var href = $link.attr('href');
      var protocol = this.protocol + '//';
      // HTML5 w/ jquery to access data attribute
      var trigger = $link.data().trigger === undefined ? true : $link.data().trigger;

      if (href.slice(protocol.length) !== protocol) {
        e.preventDefault();
        Backbone.history.navigate(href, {trigger: trigger});
      }      
    }

  });

  // kickstart the controller above when this module is started
  Selector.on("start", function () {
    var controller = new Selector.Controller();
  });

});