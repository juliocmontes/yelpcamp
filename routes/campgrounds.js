const express = require('express');
const router = express.Router();

//==============
// Campground Routes
//==============

// Index - show campgrounds 
router.get('/campgrounds', function(req, res) {
	// all campgrounds from db
	Campground.find({}, function(err, allcampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allcampgrounds, currentUser: req.user});
		}
	});
});

// Create - add a new campground
router.post('/campgrounds', function(req, res) {
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

// New - show form to create new campground
router.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new');
});

// Show - shows more info about campground
router.get('/campgrounds/:id', function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

// Update - edit existing campground details
router.get('campgrounds/:id/edit', (req, res) => {});

module.exports = router;