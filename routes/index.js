const express = require('express'),
	router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

router.get('/', function(req, res) {
	res.render('home');
});

//==============
// Auth Routes
//==============

// Show Registration Page
router.get('/register', (req, res) => {
	if (isSignedIn) {
		res.render('register');
	} else {
		res.redirect('/');
	}
});

// Register User
router.post('/register', (req, res) => {
	// User and Password details
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

// Show Login Page
router.get('/login', (req, res) => {
	res.render('login');
});

// Login User
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/campgrounds',
		failureRedirect : '/login',
		failureFlash    : true
	}),
	(req, res) => {}
);

// Logout
router.get('/logout', (req, res) => {
	//logout route
	req.logout();
	res.redirect('/');
});

// Middleware -- Logged In
function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
