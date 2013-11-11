var events = require("events");
var Auth = require([__dirname, "auth"].join("/"));

var request = null;
var auth = null;

function Miner(options){
    auth = Auth(options.consumer_key, options.consumer_secret);
    events.EventEmitter.call(this);
}

Miner.super_ = events.EventEmitter;
Miner.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Miner,
        enumerable: false
    }
});

// start the mining
Miner.prototype.start = function(options){
    var self = this;
    var keyword = options.keyword.replace(/[^a-zA-Z 0-9]+/g,"");
    this.setTimeout(options.duration);
    request = auth.get(encodeURI("https://stream.twitter.com/1.1/statuses/filter.json?track=" + keyword), options.token, options.token_secret);
    request.addListener("response", function(response){
        response.setEncoding("utf8");

        response.addListener("data", function(chunk){
            self.emit("tweet", chunk);
            self.tweets++;
		});

    	if(response.statusCode !== 200){
            self.emit("error", [response.statusCode, "returned when connecting to Twitter"].join(" "));
            self.clearTimeout();
        }
	});

    request.on("error", function(err){
        self.emit("error", err.message);
    });

	request.end();
    return self;
}

Miner.prototype.tweets = 0;
Miner.prototype.timeout = null;

// set the mine duration
Miner.prototype.setTimeout = function(duration){
    var self = this;
    this.timeout = setTimeout(function(){
        self.end();
    }, duration);
}

// clear the timeout and end the mine
Miner.prototype.clearTimeout = function(){
    clearTimeout(this.timeout);
    this.end();
}

// abort the streaming api request and let the client know we're done
Miner.prototype.end = function(){
    request.abort();
    this.emit("complete");
}

module.exports = Miner;
