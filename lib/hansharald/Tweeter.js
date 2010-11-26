var Tweeter = function(credentials) {
  var OAuth = require('oauth').OAuth
    
  this.credentials = credentials
  this.oAuth = new OAuth( 
    Tweeter.ENDPOINTS.rt,
    Tweeter.ENDPOINTS.at,
    this.credentials.consumerKey,
    this.credentials.consumerSecret,
    "1.0A", null, "HMAC-SHA1"
  )
}

Tweeter.ENDPOINTS = {
  rt: "http://twitter.com/oauth/request_token",
  at: "http://twitter.com/oauth/access_token",
  update: "http://api.twitter.com/1/statuses/update.json",
  list: "http://api.twitter.com/1/statuses/user_timeline.json"
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

Tweeter.prototype.getLastTweets = function(callback, num) {
  callback = callback || function(){}
  num = num || 1
  
  this.oAuth.get(
    Tweeter.ENDPOINTS.list, this.credentials.accessToken, this.credentials.accessTokenSecret, function(error, data) {
      if(error)
        console.log(require('sys').inspect(error))
      else {
        data = JSON.parse(data)
        
        var tweets = []
        for(var i=0; (i<data.length)&&(i<num);i++)
          tweets.push(data[i])
        callback(tweets)
      }
    }
  )
}

Tweeter.prototype.tweet = function(message) {
  message = message || this.getTweetMessage()
  
  this.oAuth.post(
    Tweeter.ENDPOINTS.update, this.credentials.accessToken, this.credentials.accessTokenSecret,
    { "status": message },
    function(error, data) {
      if(error) console.log(require('sys').inspect(error))
      else console.log(data)
    }
  )
}

module.exports.Tweeter = Tweeter;