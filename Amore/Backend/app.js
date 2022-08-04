var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var menuItemsRouter = require('./routes/menuItems');
var usersRouter = require('./routes/users');
var ordersRouter = require('./routes/orders');
const mongoose = require('./config/database');
const jwt = require('jsonwebtoken');
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000"
};

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

var app = express();

app.get('/', function(req, res){
  res.json({"tutorial" : "Build REST API with node.js"});
});


app.use(cors(corsOptions))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/menuItems',validateUser, menuItemsRouter);
app.use('/users',usersRouter);
app.use('/orders',validateUser, ordersRouter);
//app.use('/users', validateUser, usersRouter)
function validateUser(req, res, next) {
    jwt.verify(
        req.headers['x-access-token'],
        ACCESS_TOKEN_SECRET,
        function (err, decoded) {
            if (err) {

              console.log(err)
              res.status(400).json({ status: 'error', message: err.message, data: null });
            } else {

                // add user id to request
                req.body.userId= decoded.user._id;
                req.body.email = decoded.user.email;
                req.body.isAdmin= decoded.user.isAdmin;
                next();
          }
        }
    );
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
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.send("error");
});
app.listen(8080, function(){
	console.log('Tarey Zameen Par on port 8080');
});

module.exports = app;
