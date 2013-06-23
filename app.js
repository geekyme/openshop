/* ==== Node.js Packages to use ==== */
var express = require('express'); // For a full functioning web server
var http = require('http'); // Need this to create the express server
var path = require('path'); // For putting the right separators between file folders
var helmet = require('helmet'); // For higher level security
/* ========================================================  */

/* ==== Make jade templates available in browsers via javascript template functions ==== */
var templatizer = require('templatizer');
templatizer(path.join(__dirname,'views'), path.join(__dirname,'public/js/build/templates.js')); 
/* ========================================================  */

/* ==== Setup Express ==== */
var app = express(); // create an instance of our express app 
var OrientDBStore = require('connect-orientdb')(express); // to handle sessions 
var DBConf = require('./conf/dbConf'); // store all database credentials and config here
var settings = {
    server: {
        host: DBConf.host,
        port: DBConf.port
    },
    db: {
        user_name: DBConf.username,
        user_password: DBConf.password
    },
    database: DBConf.database,
    class_name: "Session"
};
var sessionStore = new OrientDBStore(settings); // create a session storage in OrientDB
/* ========================================================= */

/* ==== Configure Express ==== */
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views'); // folder for templating engine to look in
  app.set('view engine', 'jade'); // templating engine
  app.use(require('stylus').middleware({ src: __dirname + '/public' })); // styling engine and folder
  app.use(express.favicon()); // auto generate a favicon
  app.use(express.logger('dev')); // log everything that happens in the server
  app.use(express.bodyParser());
  // helmet for increased security
  app.use(express.methodOverride());
  app.use(helmet.xframe()); 
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.cacheControl());
  // Session & Cookies
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "187n mnko21908qnxxgy1n9x1",
    cookie: {httpOnly: true, maxAge: 10*60*1000},
    store: sessionStore
  }));
  // Implement Express' built in CSRF
  app.use(express.csrf());  
  app.use(function (req, res, next) {
    // make sure we pass a token to our jade templates. These tokens could be embedded in HTML forms.
    res.locals.csrftoken = req.session._csrf;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// error handling for development envt
app.configure('development', function(){
  app.use(express.errorHandler());
});

// error handling for production envt
app.configure('production', function(){
  // custom error handler
  app.use(function(err, req, res, next){
    // passing the FB package here since our error template has still the option to login via facebook
    var FB = require('fb');
    var loginUrl = FB.getLoginUrl({ scope: 'user_about_me, email, publish_stream' });
    var user = req.session.user;
    console.log(err);
    res.render('error', {user: undefined, loginUrl: loginUrl});
  });
});
/*============================================== */ 


/* ==== Routes ==== */
require('./router')(app);
/* =================*/

var ProcessConf = require('./conf/processConf');

/* ==== Server ==== */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  // drop permissions, not available on windows
  /*process.setgid(ProcessConf.gid);
  process.setuid(ProcessConf.uid);*/
});
