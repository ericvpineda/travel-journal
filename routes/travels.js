const express = require("express");
const multer = require("multer");
const router = express.Router();
// Cloudinary storage for image uplaods
// Note: node automatically looks for index.js file
const { cloudinary, storage } = require("../src/cloudinary");
const upload = multer({ storage });

// Server side validation schemas
const { validateTravel } = require("../src/middleware/middleware");
// Error handling middleware
const catchAsync = require("../src/utils/catchAsync");
// Middleware to allow login sessions
const { isLoggedIn } = require("../src/middleware/middleware");
// Middleware to authenticate author
const { isAuthor } = require("../src/middleware/middleware");
// Travel Controllers
const travelController = require("../src/controllers/travels");

// -- Travel Routes -- //

router
  .route("/")
  .get(catchAsync(travelController.index)) // Route Handler: index
  .post(
    isLoggedIn,
    upload.array("img"),
    validateTravel,
    catchAsync(travelController.createForm)
  ); // Route Handler: post

// Route Handler: create
router.get("/new", isLoggedIn, travelController.newForm);

router
  .route("/:id")
  .get(catchAsync(travelController.show)) // Route Handler: show
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("img"),
    validateTravel,
    catchAsync(travelController.updateForm)
  ) // Route Handler: Update
  .delete(isAuthor, catchAsync(travelController.deleteForm)); // Route Handler: Delete

// Route Handler: Edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(travelController.editForm)
);

module.exports = router;
