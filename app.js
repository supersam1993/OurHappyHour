var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}); // in order to get rid of warning
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"; // for security, the DATABASEURL will be set in heroku setting
mongoose.connect(url, {useMongoClient: true});


var Campground = require("./models/campground");
var Comment = require("./models/comment");

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var flash = require("connect-flash"); // make sure it is before passport
app.use(flash());

app.locals.moment = require('moment');// make sure it is before passport

var seedDB = require("./seeds");
// seedDB();




// AUTHENTICATION CONFIG
var passport = require("passport");
var LocalStrategy = require("passport-local");
// var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");

app.use(require("express-session")({
    secret:"Rusty is the best and cutest dog in the world",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize()); // setting passport up
app.use(passport.session());  // setting passport up

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

// automatically pass req.user data when using body-parser(render)
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
//     {name: "Grantile Hill", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Mountain", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//     {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
//     {name: "Grantile Hill", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Mountain", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//     {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg"},
//     {name: "Grantile Hill", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Mountain", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
// ];




var campgroundRoutes = require("./routes/campgrounds");
app.use("/campgrounds", campgroundRoutes); // when using campgroundRoutes method, automatically add "/campgrounds" before address

var commentRoutes = require("./routes/comments");
app.use("/campgrounds/:id/comments", commentRoutes);

var indexRoutes = require("./routes/index");
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Now serving your app!");
});

mongoose.Promise = global.Promise; // get rid of warning