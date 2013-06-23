module.exports = function fbConfig(FB){
	var redirectUrl;
	if(process.env.NODE_ENV != 'production'){
		redirectUrl = 'http://localhost/login/callback';
	}

	FB.options({
		appId: process.env.FACEBOOK_APPID || '',
		appSecret: process.env.FACEBOOK_APPSECRET || '',
		appNamespace: process.env.FACEBOOK_APPNAMESPACE   || '',
		redirectUri: redirectUrl || 'http://example.com'
	})

	return FB;
};