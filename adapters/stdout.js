module.exports = function(config){
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
