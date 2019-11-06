const 
    User                    = require('./models/user')
    express                 = require('express'),
	bodyParser              = require('body-parser'),
	mongoose                = require('mongoose'),
	passport                = require('passport'),
	passportLocalMongoose   = require('passport-local-mongoose'),
	LocalStrategy           = require('passport-local'),
	session                 = require('express-session'),
	methodOverride          = require('method-override'),
    expressSanitizer        = require('express-sanitizer'),
    flash                   = require('connect-flash'),
    app                     = express();

// DB Setup
const dbURL = 'mongodb://localhost/yelpcamp';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (req, res) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected to ' + dbURL)
    }
});

// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name        : String,
	image       : String,
	description : String
});

var Campground = mongoose.model('Campground', campgroundSchema);

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

// Routes

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

app.listen(8080, function() {
	console.log('Now hosting on http://localhost:8080/');
});
