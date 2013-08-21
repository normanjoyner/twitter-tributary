var _ = require("lodash");
var database = require([__dirname, "database"].join("/"));

var adapters = {

    // redis adapter
    redis: function(config){
        return {
            onStart: function(fn){
                database.redis.connect(config.host, config.port, config.database_name, config.password, function(err){
                    fn(err);
                });
            },

            onTweet: function(options, fn){
                database.redis.addToSet([options.client_name, options.name].join(":"), options.tweet, function(){
                    fn();
                });
            },

            onEnd: function(fn){
                database.redis.disconnect(function(){
                    fn();
                });
            }
        }
    },

    // standard out adpater
    stdout: function(config){
        return {
            onStart: function(fn){
                fn();
            },

            onTweet: function(options, fn){
                console.log(options.tweet);
            },

            onEnd: function(fn){
                fn();
            }
        }
    }
}

// return specified adapter
exports.get = function(adapter_name){
    return adapters[adapter_name];
}

// register a custom adapter
exports.registerAdapter = function(adapter_name, adapter_config){
    adapters[adapter_name] = function(config){
        return adapter_config;
    }
}

