const express = require('express');
const app = express();
const path = require('path');
const port = "3000";
const mongoose = require('mongoose');
const Travel = require('./models/travel');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Allow parse url form data 
app.use(express.urlencoded({extended : true}));
// Allow parse json data
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/travelJournal', {
    useNewUrlParser : true, // Allow monogoDB drivers to use new parser logic
    useUnifiedTopology : true  // Mongo driver find server to send given operation and keep trying 
})

const db = mongoose.connection;
// Change stream objects to display events 
db.once("open", (data) => console.log("MONOGODB CONNECTED!"))
db.on("error", console.error.bind(console, "MONGODB CONNECTION FAILED :("))

// Route: home 
app.get("/travels", async (req, res) => {
    const allTravels = await Travel.find({});
    res.render("travels/index", {allTravels});
})

app.get("/travels/:id", async (req, res) => {

    const {id} = req.params;
    const travel = await Travel.findById(id);
    console.log(travel)
    res.render("travels/show", {travel})
})

// Local port server
app.listen(port, () => {
    console.log(`SERVER ${port} IS LISTENING...`);
})


