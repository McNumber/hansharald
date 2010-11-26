
/**
 * Module dependencies.
 */

require.paths.unshift(__dirname + "/lib/node")
var express = require('express')
  , app     = module.exports = express.createServer()
  , Tweeter = require(__dirname + "/lib/hansharald/Tweeter").Tweeter
  , tweeter = new Tweeter(require(__dirname + "/lib/hansharald/TweeterConfig"))

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
  
  // tweeter.run(1000 * 60 * 1)
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  tweeter.getLastTweets(function(tweets) {
    res.render('index', {
      locals: { 
        tweets: tweets,
        title: "MadEvilOverlord is speaking!"
      }
    })
  }, 3)
});

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}