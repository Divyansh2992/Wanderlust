if(process.env.NODE_ENV!="production"){         //if the environment is not production then use the dotenv package to use the environment variables
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate"); //will provide the boilerplate code( a code which is common to every page of website need not need to write again and again) similar to partials in ejs
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("Connected to db");
})
.catch(err => console.log(err));

async function main() {
 // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust2');
   await mongoose.connect(dbUrl);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //needed for update
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));   //written to access the public folder

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions={                          //session options are used to store the data in the session
    store,
    secret:process.env.SECRET,               //secret is used to encrypt the data
    resave:false,                               //resave is used to save the data even if it is not modified
    saveUninitialized:true,                     //saveUninitialized is used to save the data even if it is not initialized
    cookie:{                                     //cookie is used to set the time for which the cookie will be sav
        expires:Date.now()+1000*60*60*24*7,      //expires is used to set the time for which the cookie will be saved (in this case 7 days)1000*60*60*24*7 it is in milliseconds representing 7 days
        maxAge:1000*60*60*24*7,                   //maxAge is used to set the time for which the cookie will be saved
        httpOnly:true,                           //httpOnly is used to make the cookie accessible only through http protocol (cross site scripting attacks)
    },
};

// app.get("/",(req,res)=>{
//     res.send("Hi,I am root");
// });


app.use(session(sessionOptions));               //using the session options
app.use(flash());                               //using the flash

app.use(passport.initialize());                 //using the passport
app.use(passport.session());                   
passport.use(new LocalStrategy(User.authenticate()));  //using the local strategy(use static authenticate method of model in LocalStrategy)

passport.serializeUser(User.serializeUser());          //serializeUser is used to store the user in the session
passport.deserializeUser(User.deserializeUser());      //deserializeUser is used to remove the user from the session

app.use((req,res,next)=>{  
    res.locals.success=req.flash("success");   //using the flash
    res.locals.error=req.flash("error");       //using the flash
    res.locals.currUser=req.user;            //using the user  //req.user is provided by passport //req.user is used to check if the user is logged in or not  //isko navbar.ejs me use kiya hai
    next();

});                      //locals is used to store the data in the session


 //creating a fake user
// app.get("/demouser",async (req,res)=>{                     
//     const fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     const registeredUser=await User.register(fakeUser,"helloworld");          //register is a method provided by passport-local-mongoose(here helloworld is the password) //register is a static method which automatically checks if the user already exists or not
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);              //using the routes from listing.js
app.use("/listings/:id/reviews",reviewRouter);   //using the routes from review.js
app.use("/",userRouter);                         //using the routes from user.js

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});