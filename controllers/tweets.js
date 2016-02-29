var confAuth = require('../config/auth');

var confPass = require('../config/passport');

var request = require('request');

var Twit = require('twit');

var T = new Twit({
    consumer_key         : confAuth.twitterAuth.consumerKey
  ,	consumer_secret      : confAuth.twitterAuth.consumerSecret
  , access_token         : confAuth.twitterAuth.access_token
  , access_token_secret  : confAuth.twitterAuth.access_token_secret
});


module.exports = function(ctrl, app) {

	return {

		get_hometm : function(cb) {
			T.get('statuses/home_timeline', cb)
		},

		get_usertm : function(cb) {
			T.get('statuses/user_timeline', cb) 
		},

		get_usermm : function(cb) {
			T.get('statuses/mentions_timeline', cb)
		}
	}
};