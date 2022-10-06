const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const travelSchema = new Schema({
    title : {
        type : String, 
        required : true,
    }, 
    price : {
        type : Number,
        required : true,
        min : 0
    }, 
    description : String, 
    location : String,
    img : String 
})

const Travel = mongoose.model('Travel', travelSchema);
module.exports = Travel;