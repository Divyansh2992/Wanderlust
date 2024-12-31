const Listing = require("./models/listing");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Review = require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){                 //to check if user is logged in
        req.session.redirectUrl=req.originalUrl;   //to redirect the user to the page he was trying to access before logging in
        req.flash("error","You must be signed in to create a new listing");
        return res.redirect("/login");
    }
    next();
};


module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner=async (req,res,next)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){                //to check if the user is the owner of the listing
       req.flash("error","You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
   }
   next();
};


module.exports.validateListing=(req,res,next)=>{ 
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{ 
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) { // to check if the user is the author of the review
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
