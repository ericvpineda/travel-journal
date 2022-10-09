const mongoose = require('mongoose');
const Travel = require('../models/travel');
const User = require('../models/users')
const cities = require('./cities');
const titles = require("./titles");

mongoose.connect("mongodb://localhost:27017/travelJournal", {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

const db = mongoose.connection;
db.once("open", () => {console.log("SEED DB CONNECTED!")});
db.on("error", console.error.bind(console, "UNABLE TO CONNECT SEED DB :("));

// Fake author
// Note: make sure to initialize in another async function 
const newUserAlice = async () => {
    let user = new User({username: 'Alice Wonderland', email: "wonderland@gmail.com"});
    let regUser = await User.register(user, 'pw');
    await regUser.save();
    return regUser;
}


const total = 10;
const seedDb = async () => {

    await Travel.deleteMany({});
    await User.deleteMany({});
    const regUser = await newUserAlice();

    for (let i = 0; i < total; i++) {
        let firstIdx = Math.floor(Math.random() * titles.first.length);
        let lastIdx = Math.floor(Math.random() * titles.last.length);
        let cityIdx = Math.floor(Math.random() * cities.length);
        let randNum = Math.floor(Math.random() * 100000) + 300000
        
        let travel = new Travel({
            title : titles.first[firstIdx] + " " + titles.last[lastIdx], 
            price : Math.floor(Math.random() * 100),
            description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum minus culpa quaerat ipsum tempora perferendis nobis ullam? Tenetur, facilis corporis suscipit, sequi dolorum fuga quam voluptatem quidem animi expedita repellendus!",
            location : `${cities[cityIdx].city}, ${cities[cityIdx].state}`,
            img : `https://source.unsplash.com/collection/${randNum}/1600x900`,
            author : regUser._id
        })
        await travel.save();
    }
}

seedDb().then(() => {mongoose.connection.close()});

