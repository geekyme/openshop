// This database object creates a database connection and export all its methods

var orientdb = require('orientdb');

var server = new orientdb.Server({
    host: Config.DB.host,
    port: Config.DB.port
});

var DB = new orientdb.GraphDb(Config.DB.name, server, {
    user_name: Config.DB.username,
    user_password: Config.DB.password
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