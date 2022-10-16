const express = require('express');
const app = express();
const path = require('path');
const oneWeek = 1000 * 60 * 60 * 24 * 7;
const mongoose = require('mongoose');
const User = require('./models/user');
const methodOveride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const MongoDbStore = require('connect-mongo');
let port = process.env.PORT;
let secret = process.env.SECRET;
let dbUrl = process.env.ATLAS_MONGO_DB_URL;

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    dbUrl = 'mongodb://localhost:27017/travelJournal';
    port = '3000';
    secret = 'thisisahorriblesecret';
}

// Allow for multiple strategies for auth 
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Routes 
const travelRoutes = require('./routes/travels');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Error handling functions 
const ExpressError = require('./utils/expressError');
// Help prevent cross site scripting (xss) attacks
const mongoSanitize = require('express-mongo-sanitize');
// Middleware to manipulate headers for security 
const helmet = require('helmet');

// Package for layout templating
app.engine('ejs', ejsMate)

// Allow for ejs files 
app.set('view engine', 'ejs');
// Set routes to viewws folder
app.set('views', path.join(__dirname, '/views'));

// Allow parse url form (tag) data 
app.use(express.urlencoded({extended : true}));
// Allow parse json data
app.use(express.json());
// Allow for delete and put routes 
app.use(methodOveride('_method'))
// Allow for http request info in terminal
app.use(morgan('common'))
// Allow for static files
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDbStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 // Prevent resaves from every user refresh
})

store.on("error", (e) => {
    console.log("Session store error.");
})

// Allow for sessions (default sessions store: memoryStore)
app.use(session({
    store, 
    name : 'session', // name session id
    secret,
    resave : false, // Prevent sesseion from being saved back to session store
    saveUninitialized : true, // Prevent forse session that is uninitialized to be saved to store
    cookie : {
        expires : Date.now() + oneWeek, // In milliseconds
        maxAge : oneWeek,
        httpOnly : true, // Prevent (session) cookie from accessed on client side js
        // secure : true // Cookies only work on https (local host not https)
    }
}))
// Allow for flash middleware
app.use(flash());

app.use(passport.initialize());
// Allow for persistent login session 
app.use(passport.session())
// Use passports local strategy on user authenticate model (from passport-local-mongoose) 
passport.use(new LocalStrategy(User.authenticate()));

// Used for storing and remove users in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Sanitize query strings to prevent xss db attacks
app.use(mongoSanitize({
    replaceWith : '_'
}));

const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://code.jquery.com/",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css",
    "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/5.0.0/mdb.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const imgSrcUrls = [
    "https://res.cloudinary.com/traveljournal/", 
    "https://images.unsplash.com/",
    "https://source.unsplash.com",
]

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                ...imgSrcUrls
            ],
            objectSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            connectSrc: ["'self'", ...connectSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
        },
    })
);

// Flash middleware
// Note: can access in .ejs files via end value (ex: currentUser)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routing function for Users routes
app.use('/', userRoutes);
// Routing function for Travel routes
app.use('/travels', travelRoutes);
// Routing function for Review routes
app.use('/travels/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})

// Connection to mongo database 
mongoose.connect(dbUrl, {
    useNewUrlParser : true, // Allow monogoDB drivers to use new parser logic
    useUnifiedTopology : true,  // Mongo driver find server to send given operation and keep trying 
})

const db = mongoose.connection;

// Change stream objects to display events 
db.once('open', () => console.log('MONOGODB CONNECTED!'))
db.on('error', console.error.bind(console, 'MONGODB CONNECTION FAILED :('))

// Middleware: Invalid Page
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found :('));
})

app.use((err, req, res, next) => {
    const {errorCode = 500} = err;
    if (!err.message) {
        err.message = 'Oh no, something went wrong...'
    }
    res.status(errorCode).render('error', {err});
})

// Local port server
app.listen(port, () => {
    console.log(`SERVER ${port} IS LISTENING...`);
})


