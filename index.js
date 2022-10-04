const express = require('express');
const app = express();
const path = require('path');
const port = "3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Route: home 
app.get("/", (req, res) => {
    res.render("new");
})


// Local port server
app.listen(port, () => {
    console.log(`SERVER ${port} IS LISTENING...`);
})


