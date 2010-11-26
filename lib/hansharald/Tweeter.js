var Tweeter = function(credentials) {
  this.credentials = credentials;
}

Tweeter.ENDPOINTS = {
  rt: "http://twitter.com/oauth/request_token",
  at: "http://twitter.com/oauth/access_token",
  post: "http://api.twitter.com/1/statuses/update.json"
}

Tweeter.prototype.run = function(sleepDuration) {
  var self = this
  setInterval(function() { self.tweet() }, sleepDuration)
}

Tweeter.prototype.getTweetMessage = function() {
  var tweetMessages = require(__dirname + "/TweeterMessages").Messages
    , index = Math.floor(Math.random() * tweetMessages.length)

  return tweetMessages[index]
}

Tweeter.prototype.tweet = function(message) {
  message = message || this.getTweetMessage()
  
  var OAuth = require('oauth').OAuth
  var oAuth = new OAuth( Tweeter.ENDPOINTS.rt, Tweeter.ENDPOINTS.at, this.credentials.consumerKey,  this.credentials.consumerSecret, "1.0A", null, "HMAC-SHA1")
  
  oAuth.post(
    Tweeter.ENDPOINTS.post, this.credentials.accessToken, this.credentials.accessTokenSecret,
    { "status": message },
    function(error, data) {
      if(error) console.log(require('sys').inspect(error))
      else console.log(data)
    }
  )
}

module.exports.Tweeter = Tweeter;