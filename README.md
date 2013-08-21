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

**register custom adapters (optional):**
```javascript
tributary.registerAdapter("custom_adapter", {
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
});
```

Registering a custom adapter makes it available for use when configuring your tributary.
Read more about custom adapter configuration in the custom adapter section.

**configure your tributary:**
```javascript
tributary.config({
    consumer_key: "*************************",
    consumer_secret: "*******************************************",
    adapter: {
        type: "custom_adapter",
        config: {
            custom_key: "custom value"
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
