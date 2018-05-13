var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator=require('express-validator');

var fs=require('fs');

var gos="";

//Authentication Packages
var session=require('express-session');
var passport=require('passport');
var MySQLStore = require('express-mysql-session')(session);
var LocalStrategy =require('passport-local'),Strategy;
var bcrypt=require('bcrypt');

//Variables for file uploading
const fileUpload = require('express-fileupload');
var formidable = require('formidable');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

var options = {
  host: "localhost",
  user: "root",
  password: "reason",
  database: "virtual_library"
};
var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'iuytreuytr',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username);
    console.log(password);
    //const db=require('./user.js');

    var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "reason",
    database: "virtual_library"
  });

    con.query('SELECT  password from users where username=?',[username],function(err,results,fields){
      if(err){
        done(err)};
        if(results.length == 0){
          done(null,false);
        }else{
        
          var hash=results[0].password.toString();
          bcrypt.compare(password,hash, function(err,response){
              if(response==true){
                return done(null,{user_id: results[0].id});
              }else{
                return done(null, false);
              }
          });
        }
    })
      
  }
));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
