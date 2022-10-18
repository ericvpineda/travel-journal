const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/users');
const passport = require('passport');
const {isLoggedIn} = require('../middleware/middleware');


// -- User Routes -- // 


router.route('/register')
    .get(userController.newUser) // Route: New User
    .post(catchAsync(userController.createUser)); // Route: Post User

// Note: 
// - input for passport.authenticate is strategy
// - failureFlash allows passport to flash failure message
// - failureRedict allows passport to redirect to given route
router.route('/login')
    .get(userController.loginForm) // Route : Login 
    .post(passport.authenticate('local', // Route : Post Login
        {failureFlash : true, failureRedirect : '/login', keepSessionInfo : true}), userController.login);

router.route('/:id/profile')
    .get(isLoggedIn, catchAsync(userController.profile))

// Note: passport logout() funtion requires callback fxn
router.get('/logout', userController.logout);

router.route('/:id/account')
    .get(isLoggedIn, userController.account) // Route: account
    .delete(isLoggedIn, catchAsync(userController.deleteAccount)) // Route: delete account

module.exports = router;
