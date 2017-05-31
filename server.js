//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    path = require('path'),
    app     = express(),
    mongoose = require('mongoose'),
    eps     = require('ejs'),
    morgan  = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    http = require('http');


//add external files
var index = require('./routes/index');
var user = require('./routes/user');
var message = require('./routes/message');
//var login = require('./routes/login');
    
//Object.assign=require('object-assign')


//make folder 'public' public
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Allow parsing cookies from request headers
app.use(cookieParser());
// Session management
app.use(session({
    // Private crypting key
    "secret": "some private",
    "store":  new session.MemoryStore({ reapInterval: 60000 * 10 })
}));
///app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/skypeuqac')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

//add routes
app.use('/', index);
app.use('/login', index);
app.use('/user', user);
app.use('/message', message);

app.get('/pagecount', function (req, res) {
        res.send('{ pageCount: -2 }');
});

//websocket part
var server = app.listen(8080);
var io = require('socket.io')(server);

io.on('connection', function(socket,pseudo){
    console.log('a user connected');
      var clients = io.sockets.clients();
      console.log(clients.connected);
      socket.on('new user', function(pseudo){
                socket.pseudo = pseudo;
                console.log('connection de : ' + pseudo);
                });
      socket.on('message', function(msg){
            console.log('message: ' + msg + 'de la part de '+ socket.pseudo);
            socket.broadcast.emit('message', msg);
        });
      
      socket.on('disconnect', function () {
                console.log('a user disconnected');
                });
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        });

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});



//app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
