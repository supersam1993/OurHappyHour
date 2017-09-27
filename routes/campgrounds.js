var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // if address is a folder, goes to its index.js
var geocoder = require('geocoder');

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            // res.render("campgrounds/index", {campgrounds: allCampgrounds});
            res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // //get data from form and add to campgrounds array
    // var author = {
    //     id: req.user._id,
    //     username: req.user.username
    // }
    // var newCampground = {name:req.body.name, price: req.body.price, image:req.body.image, description: req.body.description, author: author};
    // // Create a new campground and save to DB
    // Campground.create(newCampground, function(err, newlyCreated){
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         //redirect back to campgrounds page
    //         console.log(newlyCreated);
    //         res.redirect("/campgrounds");
    //     }
    // });
    
    
    //get data from form and add to campgrounds array
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name:req.body.name, price: req.body.price, image:req.body.image, description: req.body.description, author: author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new"); // default is under views folder, nothing to do with get("/campgrounds/news"
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    }); 
});

// EDIT CAMPGROUNDS ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground}); // render path default in views folder, don't need "/"
    });
});

// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if (err) {
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     })
// });

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});








// DESTROY CAMPGROUNDS ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})







// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next) {
//     // Check if login
//     if (req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if (err) {
//                 res.redirect("back");
//             } else {
//                 // Check if it is the author
//                 if (foundCampground.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }




module.exports = router;
