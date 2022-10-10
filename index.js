if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const port = '3000';
const oneWeek = 1000 * 60 * 60 * 24 * 7;
const mongoose = require('mongoose');
const User = require('./models/users');
const methodOveride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash')

// Allow for multiple strategies for auth 
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Routes 
const travelRoutes = require('./routes/travels');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// Error handling functions 
const ExpressError = require('./utils/expressError');


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
// Allow for sessions (default sessions store: memoryStore)
app.use(session({
    secret : 'thisisahorriblesecret',
    resave : false, // Prevent sesseion from being saved back to session store
    saveUninitialized : true, // Prevent forse session that is uninitialized to be saved to store
    cookie : {
        expires : Date.now() + oneWeek, // In milliseconds
        maxAge : oneWeek,
        httpOnly : true // Prevent cookie from accessed on client side script
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


// Connection to mongo database 
mongoose.connect('mongodb://localhost:27017/travelJournal', {
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


