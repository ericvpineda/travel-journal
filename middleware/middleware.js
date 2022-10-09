const Travel = require('../models/travel');
const Review = require('../models/review');
const Joi = require('joi');
const ExpressError = require('../utils/expressError');

// Check user authentication 
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Allow return to original url if user originally did not have access
        req.flash('error', "Please log in.");
        return res.redirect('/login');
    } 
    next();
    
}

const isAuthor = async (req, res, next) => {
    const travel = await Travel.findById(req.params.id);
    if (travel && !travel.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/travels/${travel._id}`);
    }
    next();
}

// Server side validation: Prevent 3rd party post routes from creating new Travel data
const validateTravel = (req, res, next) => {
    const travelSchema = Joi.object({
        travel: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().min(0),
            description: Joi.string().required(),
            location: Joi.string().required(),
            img: Joi.string().required()
        }).required()
    })
    const {error} = travelSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            body: Joi.string().required()
        }).required()
    })
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (review && !review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/travels/${id}`);
    }
    next();
}

module.exports.validateTravel = validateTravel;
module.exports.validateReview = validateReview;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isAuthor = isAuthor;
module.exports.isReviewAuthor = isReviewAuthor;