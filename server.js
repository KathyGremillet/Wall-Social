// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var swig     = require('swig');
var FB       = require('fb');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var ctrl = {};


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// controllers =================================================================
ctrl.tweet = require('./controllers/tweets.js')();
ctrl.fb = require('./controllers/facebook.js')(ctrl);

require('./config/passport')(passport, ctrl); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// View engine setup
// utilisation du moteur de swig pour les .html
app.engine('html', swig.renderFile); 
// utiliser le moteur de template pour les .html
app.set('view engine', 'html'); 
// dossier des vues
app.set('views', __dirname + '/views'); 

// view cache
app.set('view cache', false); // désactivation du cache express
swig.setDefaults({ cache: false }); // désactivation du cache swig

// required for passport
app.use(session({ secret: 'ilovepandas' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
/*app.use('/static', express.static('public'));*/


// routes ======================================================================
require('./app/routes.js')(app, passport, ctrl); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);