const Travel = require('../models/travel');
const Review = require('../models/review');

const newReview = async (req, res) => {
    const {id} = req.params;
    const review = new Review(req.body.review);
    const travel = await Travel.findById(id);
    travel.reviews.push(review);
    console.log(req.user)
    review.author = req.user._id;
    await review.save();
    await travel.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/travels/${id}`)
}

const deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Travel.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted review!');
    res.redirect(`/travels/${id}`)
}

module.exports = {newReview, deleteReview};