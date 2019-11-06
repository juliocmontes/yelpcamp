const User = require('./models/user'),
	Campground = require('./models/campgrounds'),
	express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	passportLocalMongoose = require('passport-local-mongoose'),
	LocalStrategy = require('passport-local'),
	session = require('express-session'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	flash = require('connect-flash'),
	path = require('path'),
	app = express();

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
app.set('view engine', 'ejs'); // set ejs as default view engine, won't need .ejs extension below
app.use(methodOverride('_method')); // allows us to use PUT/Delete calls in forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // sets path for CSS/static assets
app.use(expressSanitizer()); // Keep JS from being injected
app.use(flash());

// ===============
//  Authentication
// ===============
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

// ===============
//  REST Routes
// ===============
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/campgrounds', function(req, res) {
	// all campgrounds from db
	Campground.find({}, function(err, allcampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { campgrounds: allcampgrounds });
		}
	});
});

app.get('/campgrounds/new', function(req, res) {
	res.render('new');
});

app.get('/campgrounds/:id', function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render('show', { campground: foundCampground });
		}
	});
});

app.get('campgrounds/:id/edit', (req, res) => {});

app.post('/campgrounds', function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = { name: name, image: image, description: description };
	// create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

// Auth Routes
app.get('/register', (req, res) => {
	if (isSignedIn) {
		res.render('register');
	} else {
		res.redirect('/');
	}
	// show register
});

app.post('/register', (req, res) => {
	// register
	req.body.username;
	req.body.password;
	User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/campgrounds');
		});
	});
});

app.get('/login', (req, res) => {
	//login page
	// show login form
	res.render('login');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/campgrounds',
		failureRedirect : '/login',
		failureFlash    : true
	}),
	(req, res) => {}
);

app.get('/logout', (req, res) => {
	//logout route
	req.logout();
	res.redirect('/');
});

function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen(5050, function() {
	console.log('Now hosting on http://localhost:5050/');
});
