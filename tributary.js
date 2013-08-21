var _ = require("lodash");
var Client = require([__dirname, "lib", "client"].join("/"));
var adapters = require([__dirname, "lib", "adapters"].join("/"));

function Tributary(){}

// configure the tributary
Tributary.prototype.config = function(config){
    this.config = _.defaults(config, {
        consumer_key: null,
        consumer_secret: null,
        adapter: {
            type: "stdout",
            config: {}
        }
    });

    this.adapter = adapters.get(this.config.adapter.type)(this.config.adapter.config);
}

// connect to the adapter
Tributary.prototype.start = function(fn){
    this.adapter.onStart(function(err){
        if(err)
            throw err;
        else
            fn();
    });
}

// end the tributary and force close all client connections
Tributary.prototype.end = function(fn){
    var self = this;
    this.adapter.onEnd(function(err){
        if(err)
            throw err;
        else{
            _.each(self.clients, function(client){
                client.end();
            });
            self.clients = {};
            self.adapter = null;
            self.config = {};
            fn();
        }
    });
}

Tributary.prototype.adapter = null;
Tributary.prototype.clients = {};

// add a client
Tributary.prototype.addClient = function(options){
    if(_.has(options, "name") && _.has(options, "token") && _.has(options, "token_secret")){
        this.clients[options.name] = new Client(options, this);
        return this.clients[options.name];
    }
    else
        return null;
}

// return the specified client
Tributary.prototype.getClient = function(name){
    return this.clients[name];
}

// register a custom adapter
Tributary.prototype.registerAdapter = function(adapter_name, adapter_config){
    adapters.registerAdapter(adapter_name, adapter_config);
}

module.exports = Tributary;
