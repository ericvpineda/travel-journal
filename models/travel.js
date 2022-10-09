const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
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
    img : String,
    reviews: [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }],
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})

// Middleware to delete all reviews asso. with Travel element 
travelSchema.post("findOneAndDelete", async (travel) => {
    if (travel.reviews.length) {
        await Review.deleteMany({_id : {$in : travel.reviews}})
    }
})

const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;