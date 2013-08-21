var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var adapters = {};
var available_adapters = fs.readdirSync([__dirname, "..", "adapters"].join("/"));
_.each(available_adapters, function(adapter){
    adapters[path.basename(adapter, ".js")] = require([__dirname, "..", "adapters", adapter].join("/"));
});

// return specified adapter
exports.get = function(adapter_name){
    return adapters[adapter_name];
}

// register a custom adapter
exports.registerAdapter = function(adapter_name, adapter_fn){
    adapters[adapter_name] = adapter_fn;
}
