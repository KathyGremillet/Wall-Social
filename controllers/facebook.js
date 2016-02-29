var confAuth = require('../config/auth');
var confPass = require('../config/passport');
var FB = require('fb');

module.exports = function(ctrl) {

	return {

		fbtoken : null,
		
		get_homefb : function(cb) {	

			from_id	= new Array();

			//Access token
			var userfb_access_token = ctrl.fb.fbtoken;

			//Extend Access Token
			FB.api('oauth/access_token', {
			    client_id: confAuth.facebookAuth.facebook_api_key,
			    client_secret: confAuth.facebookAuth.facebook_api_secret,
			    grant_type: 'fb_exchange_token',
			    fb_exchange_token: userfb_access_token
			}, function (res) {
			    if(!res || res.error) {
			        console.log(!res ? 'error occurred' : res.error);
			        return;
			    }		

			    var accessToken = res.access_token;
			    var expires = res.expires ? res.expires : 0;

			    FB.setAccessToken(accessToken);

			    //Function to get the User's Feed
			    FB.api('me/feed?fields=from,picture,type,status_type,link,source,name,description,id,message,created_time,story', {access_token: accessToken}, function (resfb) {

				  if(!resfb || resfb.error) {
				    console.log(!resfb ? 'error occurred' : resfb.error);
				    return;
				  }				  	
							  
				  cb(resfb);
				  
				});

			});
	
		}

	}
};