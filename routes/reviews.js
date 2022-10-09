const express = require('express');
// mergeParams preserve req.params from parent router
const router = express.Router({mergeParams : true});
// Server side validation schemas
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware/middleware');
// Error handling middleware 
const catchAsync = require('../utils/catchAsync');
// Review controller functions 
const reviewController = require('../controllers/reviews');


// -- Review Routes -- //


// Route: Post new review
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.newReview))
// Route: Delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;