var _ = require("lodash");
var events = require("events");
var Miner = require([__dirname, "miner"].join("/"));

function Client(config, tributary){
    this.config = config;
    this.tributary = tributary;
    events.EventEmitter.call(this);
}

Client.super_ = events.EventEmitter;
Client.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Client,
        enumerable: false
    }
});

// add a new collection
Client.prototype.collect = function(options){
    if(_.has(options, "keyword") && _.has(options, "duration") && _.has(options, "name")){
        if(_.isNull(this.current)){
            this.current = options;
            this.mine();
        }
        else
            this.queue.push(options);
    }
}

var miner = null;

// start the mining process
Client.prototype.mine = function(){
    var self = this;

    miner = new Miner({
        consumer_key: this.tributary.config.consumer_key,
        consumer_secret: this.tributary.config.consumer_secret
    });
    miner.start({
        keyword: this.current.keyword,
        duration: this.current.duration,
        token: this.config.token,
        token_secret: this.config.token_secret
    });

    miner.on("tweet", function(tweet){
        self.tributary.adapter.onTweet({
            name: self.current.name,
            client_name: self.config.name,
            tweet: tweet
        }, function(){
            self.emit("tweet", {
                name: self.current.name, 
                tweet: tweet
            });
        });
    });

    miner.on("error", function(err){
        self.emit("error", err);
    });

    miner.on("complete", function(){
        self.emit("complete", {
            name: self.current.name,
            tweets: miner.tweets
        });
        if(!_.isEmpty(self.queue)){
            self.current = _.first(self.queue);
            self.queue = _.rest(self.queue);
            self.mine();
        }
        else
            self.current = null;
    });
}

// end all mining, effictively killing the client
Client.prototype.end = function(){
    this.queue = [];
    miner.clearTimeout();
    miner = null;
    this.current = null;
}

Client.prototype.current = null;
Client.prototype.queue = [];

module.exports = Client;
