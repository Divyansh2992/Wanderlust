const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");             //using the middleware function
const listingController=require("../controllers/listings.js");
const multer  = require('multer')                   //multer is used to upload files
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });             //destination where the files will be uploaded


router.route("/")
.get(wrapAsync(listingController.index))            //Index route //get all the listings
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));           //Create route //create a new listing

 //new route
 router.get("/new",isLoggedIn,listingController.renderNewForm);
 
 router.route("/:id")
 .get(wrapAsync(listingController.showListing))            //show route
 .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))            //update route
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));            //delete route
 
 
 //edit route
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


 module.exports=router;