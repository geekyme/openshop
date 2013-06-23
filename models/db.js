// This database object creates a database connection and export all its methods

var orientdb = require('orientdb');
var DBConf = require('../conf/dbConf');

var server = new orientdb.Server({
    host: DBConf.host,
    port: DBConf.port
});

var DB = new orientdb.GraphDb("voucher", server, {
    user_name: DBConf.username,
    user_password: DBConf.password
});

DB.open(function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("Successfully connected to OrientDB");
    ensureSchemaIsSetup(function(){
    	if(err) return err;
    })
    return;
});

// setup schema in database, if applicable.
function ensureSchemaIsSetup(callback) {
    if (DB.getClassByName("Item") === null) {
        DB.createClass("Item", "OGraphVertex", callback);
    }
    if (DB.getClassByName("User") === null) {
        DB.createClass("User", "OGraphVertex", callback);
    }
    if (DB.getClassByName("Category") === null) {
        DB.createClass("Category", "OGraphVertex", callback);
    }
    if (DB.getClassByName("Like") === null) {
        DB.createClass("Like", "OGraphEdge", callback);
    }
}

module.exports = DB;