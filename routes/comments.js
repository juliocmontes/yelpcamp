const express = require('express');
const router = express.Router();
const Campground = require("../models/campground")
const Comment = require("../models/comment")

// Show New Comment Page
router.get('/campgrounds/:id/comments/new', isSignedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// Create Comment
router.post('/campgrounds/:id/comments', (req, res) => {
	// lookup campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			console.log(req.body.comment);
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;