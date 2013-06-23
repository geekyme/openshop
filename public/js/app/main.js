App = (function(Backbone, Marionette){

  // customize Dropzone options
  Dropzone.options.dropzone = false;

  var App = new Marionette.Application();

  // create a custom region to be added.

  var ModalRegion = Marionette.Region.extend({
    el: "#modal",
    constructor: function(){
      // all the object properties bind onto it
      _.bindAll(this);
      Marionette.Region.prototype.constructor.apply(this, arguments);
      this.on('show', this.showModal, this);
    },
    getEl: function(selector){
      var $el = $(selector);
      $el.on('hidden', this.close);
      return $el;
    },
    showModal: function(view){
      view.on('close', this.hideModal, this);
      this.$el.modal('show');
    },
    hideModal: function(){
      Backbone.history.navigate(Backbone.history.back, false);
      this.$el.modal('hide');
    }
  })

  // add the custom region together with the rest of the region definition
  App.addRegions({
    nav: "#top",
    main: "#main-body",
    footer: "#footer",
    modal: ModalRegion
  });

  // start the sub application 'selector' when you start App
  App.addInitializer(function() {
    App.module("Selector").start();
  });

  // once the above is done, routers would be setup and Backbone History can be started. 
  // Start with push state to upgrade hash url to normal url. Note: web server must be able to serve content from those url
  App.on("initialize:after", function(){
    if (Backbone.history){
      Backbone.history.start({pushState: true});
    }
  });

  // define a method for other files to start sub application
  App.startSubApp = function(appName, args){
    var currentApp = App.module(appName);
    // don't start sub app if its already started.
    if (App.currentApp === currentApp){ return; }

    // stop the current application if its running
    if (App.currentApp){
      App.currentApp.stop();
    }

    // change current application to the selected one.
    App.currentApp = currentApp;
    console.log('Starting: '+appName);
    // then start it.
    currentApp.start(args);
  };

  return App;
})(Backbone, Marionette);

$(function(){
  App.start();
})