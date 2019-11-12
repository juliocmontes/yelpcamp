const User = require('./models/user'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	seedDB = require('./seeds'),
	passport = require('passport'),
	passportLocalMongoose = require('passport-local-mongoose'),
	LocalStrategy = require('passport-local'),
	session = require('express-session'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	flash = require('connect-flash'),
	path = require('path'),
	app = express();

const commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index");


// DB Setup

const dbURL = 'mongodb://localhost/yelpcamp';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to ' + dbURL);
	}
});

// Initializing App
seedDB();
app.set('view engine', 'ejs'); // set ejs as default view engine, won't need .ejs extension below
app.use(methodOverride('_method')); // allows us to use PUT/Delete calls in forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // sets path for CSS/static assets
app.use(expressSanitizer()); // Keep JS from being injected
app.use(flash());


app.use(
	session({
		secret            : 'my secret key for the campgrounds yelpcamp project site',
		resave            : false,
		saveUninitialized : false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(5050, function() {
	console.log('Now hosting on http://localhost:5050/');
});
