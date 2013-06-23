// User Class


var User = {}
module.exports = User;

var async = require('async');
var DB = require('./db.js');
var check = require('validator').check;
var sanitize = require('validator').sanitize;

// orientDB implementation
User.create = function(data, callback){
  
  data.fbid = data.id;
  // unable to get user picture in scope
  data.picture = '';
  DB.createVertex(data, {"class":"User"}, function(err, result){
      if(err) return callback(err)
      console.log(result);
      callback(null, result);
  })
}

User.get = function(fbid, callback){
    DB.command("select *, @rid from User where id = '"+fbid+"'", function (err, results) {
      if (err) return callback(err);
      // if there is no user, results[0] will be undefined
      callback(null, results[0]);
    }); 
}