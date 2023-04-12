const Travel = require('../models/travel');
const {cloudinary} = require('../cloudinary');
const mbxGeocode = require('@mapbox/mapbox-sdk/services/geocoding')
const stylesServices = mbxGeocode({accessToken: process.env.MAPBOX_TOKEN});
const {pageLastUpdated} = require('../public/js/utils.js')
const User = require('../models/user');

// -- Control Functions for Travel Object -- 

// Render travel index page 
const index = async (req, res) => {
    const allTravels = await Travel.find({}).populate('author');
    let timeUpdated = [];
    for (let i = 0; i < allTravels.length; i++) {
        timeUpdated.push(pageLastUpdated(allTravels[i].createdAt));
    }
    res.render('travels/index', {allTravels, timeUpdated});
}

// Render travel new form 
const newForm = (req, res) => {
    res.render('travels/new');
}

// Post route to create new travel  
const createForm = async (req, res, next) => {
    const geoData = await stylesServices.forwardGeocode({
        query : req.body.travel.location,
        limit : 1
    }).send();
    
    const travel = new Travel(req.body.travel);
    // Save translated coordinates 
    travel.geometry = geoData.body.features[0].geometry
    // Create file objects for uploaded images
    travel.img = req.files.map(file => ({url:file.path, filename: file.filename}));
    travel.author = req.user._id;
    await travel.save();
    await User.findByIdAndUpdate(travel.author,{$inc : {numTravels : 1}})
    req.flash('success', `Success! You've made a new Travel.`)
    res.redirect('/travels',)
}

// Render travel show page 
const show = async (req, res) => {
    const travel = await Travel.findById(req.params.id).populate({
        // Populating authors of reviews of specific travel 
        path : 'reviews',
        populate : {path : 'author'}
    }).populate('author');
     if (!travel) {
        req.flash('error', 'Error: Travel is invalid.')
        return res.redirect('/travels')
    }
    const timeUpdated = pageLastUpdated(travel.createdAt);
    res.render('travels/show', {travel, timeUpdated})
}

// Render edit page 
const editForm = async (req, res) => {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
        req.flash('error', 'Error: Travel is invalid.')
        return res.redirect('/travels')
    }
    res.render('travels/edit', {travel});
}

// Post route to update travel information 
const updateForm = async (req, res) => {
    const travel = await Travel.findByIdAndUpdate(req.params.id, {...req.body.travel});
    const img = req.files.map(file => ({url:file.path, filename: file.filename}));
    travel.img.push(...img);
    await travel.save();
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            if (file.slice(-6) !== ".splsh") {
                await cloudinary.uploader.destroy(file);
            }
        }
        await travel.updateOne({$pull : {img : {filename : {$in : req.body.deleteImages}}}});
    }
    if (!travel) {
        req.flash('error', 'Error: Travel is invalid.')
        return res.redirect('/travels')
    }
    req.flash('success', `Success! You've edited your Travel.`)
    res.redirect(`/travels/${travel._id}`);
}

// Post route to delete travel 
const deleteForm = async (req, res) => {
    const travel = await Travel.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(travel.author._id,{$inc : {numTravels : -1}}, {new : true})
    req.flash('success', `Success! You've deleted your Travel.`)
    res.redirect('/travels')
}

// Note: cannot use new/delete as consts 
module.exports = {index, newForm, createForm, show, editForm, updateForm, deleteForm}