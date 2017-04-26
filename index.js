require("dotenv").config();
const express = require("express");
const mongo = require("mongodb");
const imgfinder = require("./app/imgfinder");
const unsplash = require('unsplash-api');
unsplash.init(process.env.APP_ID);

const url = "mongodb://" + process.env.DBUSR + ":" + process.env.DBPW + "@" + process.env.DB_URI;
const dbClient = mongo.MongoClient;

dbClient.connect(url, function(err, db) {
    if (err) {
        throw err;
    }
    
    let app = express();
    app.set('port', (process.env.PORT || 5000));
    app.use(express.static(__dirname + '/views'));


    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

    imgfinder(app, unsplash, db);

    // db.close();
})
