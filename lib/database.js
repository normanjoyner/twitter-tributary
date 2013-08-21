var _ = require("lodash");
var redis = require("redis");

module.exports = {

    redis: {
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

}
