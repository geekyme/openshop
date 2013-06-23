// Facebook helper. This is mainly for the implementation of facebook login, but can be easily extended to do more.

var FB = require('fb'); // the fb sdk
var User = require('../models/user'); // for creation & retrieval of our user 
FB = require('../conf/fbConf')(FB); // get our fb configurations

var async = require('async'); // for control flow

// login function
exports.loginCallback = function (req, res, next) {
	// the callback link should have parameters after '?'
    var code = req.query.code;

    if(req.query.error) {
        // user might have disallowed the app
        return res.redirect('/');
    } else if(!code) {
        return res.redirect('/');
    }

    async.waterfall([
    	//series of functions to call, will pass results to the next function
    	exchangeCodeForAccessToken,
    	extendAccessToken
    ], function(err, result){
    	//main callback
    	if(err) return next(err);
    	/*FB.options({accessToken: result.access_token});*/
			req.session.access_token    = result.access_token;
      req.session.expires         = result.expires || 0;
      FB.napi('/me', {access_token: req.session.access_token}, function(err, response){
      	
      	User.get(response.id, function(err, user){
      		if(err) return next(err)
      		if(user){
      			console.log('retrieving user');
      			//user present so just use current user data. no creation required.
      			req.session.user = user;
		      	return res.redirect('/');
      		}else{
      			console.log('creating user');
      			//create the user if its not present in the DB
		      	User.create(response, function(err, user){
		      		if(err) return next(err);
		      		//user successfully created. Saving user to session.
		      		req.session.user = user;
		      		return res.redirect('/');

		      	})		
      		}
      	})     	
      })      
    })

	function exchangeCodeForAccessToken(callback) {
	  FB.napi('oauth/access_token', {
	      client_id:      FB.options('appId'),
	      client_secret:  FB.options('appSecret'),
	      redirect_uri:   FB.options('redirectUri'),
	      code: code
	  }, function(err, response){
	  	if(err) return callback(err);
	  	callback(null, response);
	  });
	}

	function extendAccessToken(result, callback){
	    FB.napi('oauth/access_token', {
	        client_id:          FB.options('appId'),
	        client_secret:      FB.options('appSecret'),
	        grant_type:         'fb_exchange_token',
	        fb_exchange_token:  result.access_token
	    }, function(err, response){
	    	if(err) return callback(err);
	    	callback(null, response);
	    });
	}
};

// share on fb wall
exports.share = function(req, res, next){
	var user = req.session.user
	if(user){
		FB.napi('me/feed', 'post', {message: req.body.message, access_token: req.session.access_token}, function (err, response) {
		  if(err){
		  	var type = JSON.parse(err.message).error.type
		  	if(type == 'OAuthException'){
		  		return res.send(400, 'No Auth Share')
		  	}else{
		  		return next(err);
		  	}
		  }
		  res.send(200, 'Post Id: ' + response.id);
		});
	}else{
		res.send(400, 'Not logged in');
	}
}