const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// Schema for travel objects 

// Schema for images 
const imgSchema = new Schema({
    url : String,
    filename : String
})

// Note: By default, mongoose does not include virtuals when convert document to JSON
const opts = {toJSON: {virtuals : true}, timestamps : true};

// Travel schema definition 
const travelSchema = new Schema({
    title : {
        type : String, 
        required : true,
    }, 
    price : {
        type : Number,
        required : true,
        min : 0
    }, 
    description : String, 
    location : String,
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    img : [imgSchema],
    reviews: [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }],
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
}, opts);

// Middleware to delete all reviews asso. with Travel element 
travelSchema.post("findOneAndDelete", async (travel) => {
    if (travel.reviews.length) {
        await Review.deleteMany({_id : {$in : travel.reviews}})
    }
})

// Retrive thumbnails from cloudinary url and reduce size manually 
// Note: only store urls in mongo (make it perceive that we stored image in db)
imgSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200');
})

// Note: Cannot use arrow function with virtuals
travelSchema.virtual('properties.popup').get(function () {
    return `<strong><a href="/travels/${this._id}">${this.title}</a></strong>
            <p>${this.description.slice(0,15)}...`
})

const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;