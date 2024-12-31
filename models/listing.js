const mongoose=require("mongoose");
const Review = require("./review.js");

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        
       filename:String,
       url:String,
     // default:"https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(v)=> v==="" ? "https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
     },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,         //owner is the user who created the listing         //what is scehema.Types.ObjectId=>it is used to refer to the id of the user
        ref:"User",
    },
   
});

listingSchema.post("findOneAndDelete",async (listing)=>{                    //middleware to delete reviews when a listing is deleted
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
    
});


const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;