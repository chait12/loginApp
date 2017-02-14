var mongoose = require('mongoose');

module.exports = {
    connect : function(cb){
        var str = [];
        config.MONGO.replicas.forEach(function(item){
            str.push( item );
        });

        var connUri = 'mongodb://' 
            + config.MONGO.username + ":" + config.MONGO.password 
            + "@" 
            +  str.join(',') 
            + "/" 
            + config.MONGO.database;

        console.log("Connection string:", connUri);

        mongoose.connect(connUri, function(err){
            if(err){
                console.log("Error while connection with mongodb " + err);
            }
            if(typeof cb === "function"){
                cb(err);
            }
        });

        mongoose.connection.on('connecting', function() {
            console.log('connecting to Mongo DB...');
        });

        mongoose.connection.on('error', function(error) {
            console.log('Error in Mongo DB connection: ' + error);
            //mongoose.disconnect();
        });
        mongoose.connection.on('connected', function() {
            console.log('Mongo DB connected!');
        });
        mongoose.connection.once('open', function() {
            console.log('Mongo DB connection opened!');
        });
        mongoose.connection.on('reconnected', function () {
            console.log('Mongo DB reconnected!');
        });
        mongoose.connection.on('disconnected', function() {
            console.log('Mongo DB disconnected!');
            //mongoose.connect(uriStr, opts);
        });
    }
}