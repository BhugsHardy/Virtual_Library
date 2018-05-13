var express = require('express');
var router = express.Router();
var fs=require('fs')
var multer  = require('multer')
//var upload = multer({ dest: 'public/uploads/' })
var expressValidator=require('express-validator');
var session=require('express-session');
var passport=require('passport');
var LocalStartegy =require('passport-local'),Strategy;
var formidable = require('formidable');
var bcrypt=require('bcrypt');
const saltRounds=10;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user); 
  console.log(req.isAuthenticated())
  res.render('index', { title: 'Nust Computer Science Virtual Library' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/books', authenticationMiddleware()
,function(req, res, next) {
  res.render('books',{title: 'Views of Books Uploaded'});
});

router.post('/login', passport.authenticate('local',{
  successRedirect:'/books',
  failureRedirect:'/login'
}) );

const expres = require('express');
const fileUpload = require('express-fileupload');
const app = express();
 
// default options
router.use(fileUpload());
 
router.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var sampleFile = req.files.books;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('C:/Users/Tadiwa/Desktop/Virtual_Library/public/uploads/'+req.body.bookname+'.pdf', function(err) {
    if (err)
      return res.status(500).send(err);
  
  });
  var bookname=req.body.bookname;
  var author=req.body.author;
  var date=req.body.date;
  var course=req.body.course;
  var courseCode=req.body.courseCode;
  gos=req.body.bookname;
     const db=require('./user.js');

  var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "reason",
  database: "virtual_library"
});

  con.query('INSERT INTO books (Bookname,Author,Date,Course,CourseCode) VALUES (?,?,?,?,?)',[bookname,author,date,course,courseCode], function (err, result,fields) {
    if (err) throw err;
      }) 
      res.redirect('books');
      console.log(gos);
         
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/upload', function(req, res, next) {
  res.render('upload');
  var str = "Free Web Building Tutorials!";
  var result = str.link("https://www.w3schools.com");
});

router.post('/user', function(req, res, next) {
  req.checkBody('username','Username can not be epmty.').notEmpty;
  req.checkBody('username','Username mustbe between 4-15 characters long.').len(4, 15);
  req.checkBody('email','The email you entered is not valid please try again.').isEmail;
  req.checkBody('email','Email address must be between 4-100 characters long, please try again.').len(4, 100);
  req.checkBody('password','Password must be between 8-100 characters long.').len(4, 100);
  req.checkBody('pass','Password must be between 8-100 characters long.').len(4, 100);
  req.checkBody('pass','Password do not match please try again.').equals('password');

  const errors = req.validationErrors();
  if(errors){
    console.log(`errors: ${JSON.stringify(errors)}`);

    res.render('signup',{
      title: 'SingUp error',
      errors: errors
      
    });
  }
  else{
    var username=req.body.username;
    var email=req.body.email;
    var password=req.body.password;
    var pass=req.body.pass;
     const db=require('./user.js');
  
    var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "reason",
    database: "virtual_library"
  });
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
  
    con.query('INSERT INTO users (Username,Email,Password) VALUES (?,?,?)',[username,email,hash], function (err, result,fields) {
      if (err) throw err;
      con.query('SELECT LAST_INSERT_ID() AS user_id', function(err, results, fields){
        if(err) throw err;
        const user_id=results[0];
        console.log(results[0]);
        req.login(user_id, function(err){
          res.render('index', { title: 'Nust Computer Science Virtual Library' });
          //res.redirect('/')
        });

      })
    }) 
  });
     
  }
   
  });
  passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
  passport.deserializeUser(function(user_id, done) {
          done(null, user_id);
    });
    function authenticationMiddleware () {  
      return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    
          if (req.isAuthenticated()) return next();
          res.redirect('/login')
      };
    };
    
  
module.exports = router;
