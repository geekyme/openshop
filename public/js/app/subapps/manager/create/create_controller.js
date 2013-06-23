App.module("Manager.Create", function (Create, App, Backbone, Marionette, $, _){

  Create.Controller = {
    newCreateView: function() {
      var func = _.bind(this._showCreateView, this);
      if(App.bootstrapItems){
        var newItem = App.request("new:items:entity", App.bootstrapItems);
      }else{
        var newItem = App.request("new:items:entity");
      }
      
    	var func = _.bind(this._showCreateView, this);
      $.when(newItem).then(func);
    },
    _showCreateView: function(model){
      if(App.bootstrapItems){
        delete App.bootstrapItems;        
        var createView = new Create.View({
          model: model,
          el: '#item-create-form'
        })
        App.Manager.layout.main.attachView(createView);
      }else{
        var createView = new Create.View({model: model})
        App.Manager.layout.main.show(createView);
      }
    	
      this._bindEventHandlers(createView);
      
      // initiate dropzone
      // TODO: May not be the best place to put the following chunk of code...
      var myDropzone = new Dropzone("#dropzone", {
        url: '/pictures/upload',
        maxFilesize: 1,
        paramName: 'itemImage',
        init: function(){
          this.on('sending', function(file, xhr, formData){
            formData.append('_csrf', Backbone.CSRFToken)
          });
          this.on('success', function(file, response){
            $('#imgSrc').val(response).trigger('change');
          })
        }
      })

    },
    _bindEventHandlers: function(view){
      // event handlers of the view here, separate logic from views
      view.on('change', function(event){
        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
      });

      view.on('beforeSave', function(){
        var self = this;
        this.model.save({}, {success: function(){
            console.log('saved');
        }});
      })

      view.on('clearAll', function(){
        this.$el.find('input, textarea').val('');
      });

      view.on('dropFile', function(event){
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
      })      
    }
  };
  
})