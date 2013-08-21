var _ = require("lodash");
var redis = require("redis");

var redis_db = {
    client: null,

    // connect to the redis database
    connect: function(host, port, database, password, fn){
        this.client = redis.createClient(port, host, database);
        if(!_.isNull(password)){
            this.client.auth(password, function(err, authed){
                fn(err);
            });
        }
        else
            fn();
    },

    // disconnect from redis
    disconnect: function(fn){
        this.client.quit();
        fn();
    },

    // add tweet to specified set
    addToSet: function(set, key, fn){
        this.client.sadd(set, key, function(err, result){
            fn(err, result);
        });
    }
}

module.exports = function(config){
    return {
        onStart: function(fn){
            redis_db.connect(config.host, config.port, config.database_name, config.password, function(err){
                fn(err);
            });
        },

        onTweet: function(options, fn){
            redis_db.addToSet([options.client_name, options.name].join(":"), options.tweet, function(){
                fn();
            });
        },

        onEnd: function(fn){
            redis_db.disconnect(function(){
                fn();
            });
        }
    }
}
