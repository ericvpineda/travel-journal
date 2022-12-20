const Travel = require('../models/travel');
const Review = require('../models/review');
const baseJoi = require('joi');
const ExpressError = require('../utils/expressError');
const sanitizeHTML = require('sanitize-html');

// Middleware used for client and server side validation 

// Exntention used for joi schema 
const sanitizeHtmlExt = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML' : '{{#label}} must not include html!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes : {},
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', {value})
                }
                return clean;
            }
        }
    }
})

// Joi object used for server side validation 
const Joi = baseJoi.extend(sanitizeHtmlExt);

// Check user login authentication 
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Allow return to original url if user originally did not have access
        req.flash('error', "Please log in.");
        return res.redirect('/login');
    } 
    next();
    
}

// Validate user has authorization for selected travel
const isAuthor = async (req, res, next) => {
    const travel = await Travel.findById(req.params.id);
    if (travel && !travel.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/travels/${travel._id}`);
    }
    next();
}

// Serverside validation for Travel schema 
const validateTravel = (req, res, next) => {
    const travelSchema = Joi.object({
        travel: Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().min(0),
            description: Joi.string().required().escapeHTML(),
            location: Joi.string().required().escapeHTML(),
            // img: Joi.string().required()
        }).required(),
        deleteImages: Joi.array()
    })
    const {error} = travelSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(e => e.message).join(",");
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

// Serverside validation for review schema 
const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            body: Joi.string().required().escapeHTML()
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

// Validate if user is author of selecte review 
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