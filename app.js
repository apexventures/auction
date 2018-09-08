var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// import routes files
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var bidRouter = require('./routes/bid');
var chatRouter = require('./routes/chat');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/auction');

var app = express();
// For Socket.io
var server = require('http').Server(app);
var io = module.exports.io = require('socket.io')(server);
// Socket.io 
const SocketManager = require('./socketManager');
io.on('connection', SocketManager);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('public/images'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/bid', bidRouter);
app.use('/chat', chatRouter);


// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = {app: app, server: server};