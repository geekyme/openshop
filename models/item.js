// Item Class

var Item = {};
module.exports = Item;

var DB = require('./db.js'); // getting the database object
var check = require('validator').check; // for validating data and returning true / false
var sanitize = require('validator').sanitize; // for cleaning data
var uuid = require('node-uuid'); // for generating unique id

// Methods self explanatory 

Item.getAll = function (limit, callback){
  DB.command("select *, in.out.name as owner, in.out.username as ownerusername  from item order by name", function(err, results){
    if(err) return callback(err);
    callback(null, results);
  })
}

Item.getAllFromCategory = function(limit, category, callback){
  DB.command("select *, in.out.name as owner, in.out.username as ownerusername from Item where category = '"+category+"' order by name", function(err, results){
    if(err) return callback(err);
    callback(null, results);
  })
}

Item.getUserItems = function (limit, username, callback){
  var command = "select *, in.out.name as owner, in.out.username as ownerusername from (traverse V.out, E.in from (select from User where username = '"+username+"') while $depth <= 2) where @class = 'Item'";

  DB.command(command, function(err, results){
    if(err) return callback(err);
    callback(null, results);
  })
}

Item.like = function (user, itemID, callback){
  Item.getOne(itemID, function(err, item){
    if(err) return callback(err);
    DB.command('create edge Like from '+user.rid+' to '+item['@rid'], function(err, edge){
        if(err) return callback(err)
        callback(null, 200);
    })
  })
	
}

Item.unlike = function (user, itemID, callback){
  Item.getOne(itemID, function(err, item){
    if(err) return callback(err);
    DB.command('delete edge Like from '+user.rid+' to '+item['@rid'], function(err, edge){
        if(err) return callback(err)
        callback(null, 200);
    })
  })
}

Item.getOne = function(id, callback){
  DB.command("select *, in.out.name as owner, in.out.username as ownerusername from Item where id ='"+id+"'", function(err, result){
        if(err) return callback(err)
        callback(null, result);
    })
}

Item.create = function (user, itemData, callback){
  itemData.id = uuid.v1();
  itemData.price = parseFloat(itemData.price).toFixed(2);
  delete itemData['_csrf'];
  DB.createVertex(itemData, {"class":"Item"}, function(err, result){
      if(err) return callback(err)
      // join item with user
      DB.command('create edge Owns from '+user.rid+' to '+result['@rid'], function(err, edge){
        if(err) return callback(err)
        callback(null, result);
      })
    })
}

Item.delete = function(id, callback){
  command = "delete vertex Item where id='"+id+"'";
  DB.command(command, function(err, result){
    if(err) return callback(err);
    callback(null, result);
  })
}

Item.update = function(itemData, callback){
  delete itemData['_csrf'];
  DB.save(itemData, function(err, result){
    if(err) return callback(err);
    callback(null, result);
  })
}