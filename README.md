twitter-tributary
=================

##About

###Description
A nodejs module providing access to the Twitter streaming API. Exposes a set of standard adapters, with the option of registering custom adapters.

###Author
Norman Joyner - norman.joyner@gmail.com

##Getting Started

###Installation
```
npm install twitter-tributary
```

###Configuring a Tributary

**require twitter-tributary:**
```javascript
var Tributary = require("twitter-tributary");
```

**create a new Tributary object:**
```javascript
var tributary = new Tributary();
```

**configure your tributary:**
```javascript
tributary.config({
    consumer_key: "*************************",
    consumer_secret: "*******************************************",
    adapter: {
        type: "redis",
        config: {
            host: "localhost",
            port: 6379,
            database: "tweets",
            password: "****************",
            namespace: "norman"
        }
    }
});
```

The tributary requires a consumer_key and consumer_secret which are custom to your application, and can be acquired through the [Twitter Developers Page](https://dev.twitter.com).
The adapter key is optional and if left blank will default to the stdout adapter.
To use a different standart adapter, or a custom adapter, simply set the type key in the adapter object to the name of the desired adapter.
The adapter config object is a configuration object that is accessible by the adapter.
Some adapters require certain keys to be set in this object; however, there is no standard and will vary from adapter to adpater.
See the custom adapter section configuration section to learn more about using the adapter configuration object in your own adapter.

###Registering an adapter

**register a custom adapter**
```javascript
tributary.registerAdapter("custom_adapter", function(config){
    return {
        onStart: function(fn){
            console.log("Starting the adapter ...");
            fn();
        },

        onTweet: function(options, fn){
            console.log("Just got the following tweet: " + options.tweet);
        },

        onEnd: function(fn){
            console.log("Stopping the adpater ...");
            fn();
        }
    }
});
```

The first parameter passed to the registerAdapter function will be the name of the adapter you would like to register.
It is important to note that if you name your adapter the same as a standard adapter, the standard adapter will be overwritten.
The second parameter is the a function that takes a configuration object that can be passed at the time the tributary is configured.
Your adapter can take advantage of any of the information in the config object.
For example, as with the standard redis adapter, this object may contain database host, port, password, etc.

It is required that you implement the onStart(), onTweet(), and onEnd() functions. The onStart() function takes a callback, which it should execute once it is done performing any necessary start up work. The onStart() function is called when the tributary start() function is executed. Next, the onTweet() method takes an options object, which contains the name of the collection (object.name), the name of the client (object.client_name) and the tweet itself (object.tweet). Additionally, onTweet() takes a callback. This method is called every time the miner gets a tweet from the Twitter API. Finally, onEnd() is triggered when the user calls the tributary end() function. The method takes a callback that should be executed once adapter clean up is finished.
