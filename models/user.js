const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const Travel = require('./travel');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema for user object

// Define user schema 
const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    numReviews : {
        type : Number,
        default : 0
    },
    numTravels : {
        type : Number,
        default : 0
    }
})

// If delteing user, delete associated reviews and travels 
userSchema.post("findOneAndDelete", async (user) => {
    if (user.numReviews) {
        await Review.deleteMany({author : user._id});
    }
    if (user.numTravels) {
        await Travel.deleteMany({author : user._id});
    }
})

// Handle user password and login encryption 
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User; 