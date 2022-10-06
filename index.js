const express = require('express');
const app = express();
const path = require('path');
const port = "3000";
const mongoose = require('mongoose');
const Travel = require('./models/travel');
const methodOveride = require('method-override')
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

// Package for layout templating
app.engine('ejs', ejsMate)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Allow parse url form data 
app.use(express.urlencoded({extended : true}));
// Allow parse json data
app.use(express.json());
// Allow for delete and put routes 
app.use(methodOveride("_method"))
// Allow for http request info in terminal
app.use(morgan('common'))

mongoose.connect('mongodb://localhost:27017/travelJournal', {
    useNewUrlParser : true, // Allow monogoDB drivers to use new parser logic
    useUnifiedTopology : true  // Mongo driver find server to send given operation and keep trying 
})

const db = mongoose.connection;

// Change stream objects to display events 
db.once("open", (data) => console.log("MONOGODB CONNECTED!"))
db.on("error", console.error.bind(console, "MONGODB CONNECTION FAILED :("))

// Middleware 

// Route Handler: index
app.get("/travels", async (req, res) => {
    const allTravels = await Travel.find({});
    res.render("travels/index", {allTravels});
})

// Route Handler: create
app.get("/travels/new", (req, res) => {
    res.render("travels/new");
})

// Route Handler: post 
app.post("/travels", async (req, res) => {
    const body = req.body;
    const travel = new Travel(body.travel)
    await travel.save()
    .then(() => { console.log("Saved new travel!")})
    .catch(() => {console.log("Unable to save new travel...")})

    res.redirect("/travels")
})

// Route Handler: show 
app.get("/travels/:id", async (req, res) => {

    const {id} = req.params;
    const travel = await Travel.findById(id);
    res.render("travels/show", {travel})
})

// Route Handler: Edit
app.get("/travels/:id/edit", async (req, res) => {
    const {id} = req.params;
    const travel = await Travel.findById(id);
    res.render("travels/edit", {travel});
})

// Route Handler: Update
app.put("/travels/:id", async (req, res) => {
    const {id} = req.params;
    console.log("Edited Travel...");
    const travel = await Travel.findByIdAndUpdate(id, {...req.body.travel});
    res.redirect(`/travels/${travel._id}`);
})

app.delete("/travels/:id", async (req, res) => {
    const {id} = req.params;
    console.log("Deleted Travel...");
    await Travel.findByIdAndDelete(id);
    res.redirect("/travels")
})

// Middleware: Invalid Page
app.use((req, res) => {
    res.status(404).send('Page not found :(');
})


// Local port server
app.listen(port, () => {
    console.log(`SERVER ${port} IS LISTENING...`);
})


