var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Canyon floor",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "So beautiful"
    },
    {
        name: "Desert Mesa",
        image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg",
        description: "Blah blah"
    },
    {
        name: "Santa monica",
        image: "https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
        description: "Fake"
    }
]

function seedDB() {
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("Removed Campground");
            //add campgrounds
            data.forEach(function(seed){ // becasue there is no ganruantee that delete would finish earlier than add, so we need to put add in delete as callback function
                Campground.create(seed, function(err, campground){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("add a campgrounds");
                        // add comment
                        Comment.create({
                            text: "This place is great",
                            author: "Homer"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Add a comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
