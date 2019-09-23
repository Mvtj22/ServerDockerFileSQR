//Server for the API calls for DB
// The only security in this, is that no one is touch the DB, everything has to go through a API Call
var express = require('express'),
app = express(),
mongoose = require('mongoose'),
Task = require('./api/models/model'),
bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

//Make use of CORS
var cors = require('cors');
app.use(cors());

const {
  MONGO_DB,
  DATABASE_URL,
  DATABASE_PORT
} = process.env
const url = `mongodb://${DATABASE_URL}:${DATABASE_PORT}/${MONGO_DB}`;
console.log(url);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000 // Reconnect every 1000ms
}

//Intialize mongo
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('connecting', function() {
console.log('connecting to MongoDB...');
});

db.on('error', function(error) {
console.error('Error in MongoDb connection: ' + error);
mongoose.disconnect();
});
db.on('connected', function() {
    console.log('MongoDB connected!');
});
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
});

var connectWithRetry = function() {
    return mongoose.connect(url,options, function(err) {
      if (err) {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
        setTimeout(connectWithRetry, 5000);
      }
    });
  };
connectWithRetry();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Sets the route
var routes = require('./api/routes/routes');
routes(app);


app.listen(port, function(){
  console.log(`Server started on port ${port}`);
});

