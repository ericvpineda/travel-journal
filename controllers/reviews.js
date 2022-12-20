const Travel = require('../models/travel');
const Review = require('../models/review');
const User = require('../models/user');

// Control functions for Review object 

// Post route to create new review 
const newReview = async (req, res) => {
    const {id} = req.params;
    const review = new Review(req.body.review);
    review.author = req.user._id;
    const travel = await Travel.findById(id).populate('author');
    travel.reviews.push(review);
    await review.save();
    await travel.save();
    await User.findByIdAndUpdate(travel.author._id,{$inc : {numReviews : 1}})
    req.flash('success', 'Created new review!');
    res.redirect(`/travels/${id}`)
}

// Post route to delete review 
const deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId)
    const travel = await Travel.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await User.findByIdAndUpdate(travel.author._id,{$inc : {numReviews : -1}})
    req.flash('success', 'Deleted review!');
    res.redirect(`/travels/${id}`)
}

module.exports = {newReview, deleteReview};