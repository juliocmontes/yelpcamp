const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({name: 'Granite Hill',
//                    image: 'https://specials-images.forbesimg.com/imageserve/960743598/960x0.jpg?fit=scale',
//                    description: 'This is a granite hill'
//                 }, function(err, campground){
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         console.log("New campground created...")
//                         console.log(campground)
//                     }
//                 });

app.get('/', function(req, res){
    res.render('home');
});

app.get('/campgrounds', function(req, res){
    // all campgrounds from db
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('index', {campgrounds:allcampgrounds});
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
});


app.get('/campgrounds/:id', function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err){
            console.log(err);
        } else  {
            res.render('show', {campground: foundCampground})
        }
    });
});

app.get('campgrounds/:id/edit', (req, res) => {

})

app.post('/campgrounds', function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // create new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);;
        } else {
            res.redirect('/campgrounds'); 
        }
    });
});

app.listen(8080, function() {
	console.log('Now hosting on http://localhost:8080/');
});
