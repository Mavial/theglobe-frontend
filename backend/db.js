/*


This Module Connects to a
MongoDB Database with the
Credentials provided in
the Config


*/

var mongoose = require('mongoose')
config = require('./config')

console.log("Connecting to MongoDB...");
let mongouri = "mongodb://" + config.DB.username + ":" + config.DB.password + "@" + config.DB.host + ":" + config.DB.port + "/" + config.DB.name + "?authSource=admin&w=1";
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {

        console.log("Database connection could not be established!");
        console.log(mongouri);
        console.log(err);
        console.log("Server is shutting down now!");
        process.exit(1);
    } else
        console.log("Database connection established!");
});


module.exports = mongoose
