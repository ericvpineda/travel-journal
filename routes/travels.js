const express = require('express');
const router = express.Router()

// Server side validation schemas
const {validateTravel} = require('../middleware/middleware');
// Error handling middleware 
const catchAsync = require('../utils/catchAsync');
// Middleware to allow login sessions
const {isLoggedIn} = require('../middleware/middleware');
// Middleware to authenticate author 
const {isAuthor} = require('../middleware/middleware');
// Travel Controllers
const travelController = require('../controllers/travels');


// -- Travel Routes -- // 


router.route('/')
    .get(catchAsync(travelController.index)) // Route Handler: index
    .post(isLoggedIn, validateTravel, catchAsync(travelController.createForm)); // Route Handler: post 

// Route Handler: create
router.get('/new', isLoggedIn, travelController.newForm);

router.route('/:id')
    .get(catchAsync(travelController.show)) // Route Handler: show 
    .put(isLoggedIn, isAuthor, validateTravel, catchAsync(travelController.updateForm)) // Route Handler: Update  
    .delete(isAuthor, catchAsync(travelController.deleteForm)) // Route Handler: Delete
    
// Route Handler: Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(travelController.editForm))

module.exports = router;