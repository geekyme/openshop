// Category Class

var Category = {};
module.exports = Category;

var DB = require('./db.js'); // getting the database object
var check = require('validator').check; // for validating data and returning true / false
var sanitize = require('validator').sanitize; // for cleaning data
var uuid = require('node-uuid'); // for generating unique id

Category.getAll = function (limit, callback){
  DB.command("select from Category order by name", function(err, results){
    if(err) return callback(err);
    callback(null, results);
  })
}
