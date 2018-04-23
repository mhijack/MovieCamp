const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedDB = require('./seeds.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const session = require('express-session');
const methodOverride = require('method-override');
const middleware = require('./middleware');
const flash = require('connect-flash');

// requiring routes
const commentRoutes = require('./routes/comments');
const moviesRoutes = require('./routes/movies');
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

// ====== APP configs =======
const app = express();

app.set('view engine', 'ejs');

// db is automatically created if does not exist
// local db for development purpose;
// mongoose.connect('mongodb://localhost/yelp_camp');
// separate db for production purposel
// mongoose.connect('mongodb://mhijack:147369y@ds159856.mlab.com:59856/moviecamp');
// mongodb://mhijack:147369y@ds159856.mlab.com:59856/moviecamp

const url = process.env.DATABASEURL || "mongodb://mhijack:147369y@ds159856.mlab.com:59856/moviecamp"
// in CLI, export DATABASEURL=mongodb://localhost/yelp_camp
mongoose.connect(url);

app.use(bodyParser.urlencoded({
  extended: true,
}));
// use 'path.join() to concatenate __dirname and folders
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// servers public directory
app.use(express.static(path.join(__dirname, 'public')));
// seedDB(); // seed database

// PASSPORT configs
app.use(session({
  secret: 'summer is awesome',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash()); // if receive: req.flash() is not a function; must come before passport configs

app.use(passport.initialize());
app.use(passport.session());
// ran when passport.authenticate('local') is ran
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass {currentUser: req.user} to ALL pages as variable
// app.use = "call this function on every single route"
// middlewareObj.passUserInfo must have next(), otherwise won't execute other codes
app.use(middleware.passUserInfo);

// must come before abstracting urls
app.use(methodOverride('_method'));
// use the required routes
// 1st parameter is appended to the url, thus can delete repeated urls in each router
app.use('/', indexRoutes);
app.use('/movies/:id/comments', commentRoutes);
app.use('/movies', moviesRoutes);
app.use('/admin', adminRoutes);

app.listen(process.env.PORT || 3000);
