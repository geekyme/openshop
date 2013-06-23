App.module("Manager.Create", function (Create, App, Backbone, Marionette, $, _){

  Create.View = Marionette.ItemView.extend({
    template:function(model){
        // temporary hack to populate the categories
        // TODO: create composite view to populate the categories
        $.ajax({
            url:'/api/all/categories',
            async: false,
            success: function(categories){
                model.categories = categories;                      
            }
        })  
        return templatizer.includes.create_form({item: model});
    },
    triggers: {
        'click .save': 'beforeSave',
        'drop #picture': 'dropFile',
        'click .clear': 'clearAll'
    },
    events:{
        'change':'change'
    },
    change: function(e){
        this.trigger('change', e);
    } 
  })
  
})