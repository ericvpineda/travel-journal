const Travel = require('../models/travel');

// -- Control Functions for Travel -- 

const index = async (req, res) => {
    const allTravels = await Travel.find({}).populate('author');
    res.render('travels/index', {allTravels});
}

const newForm = (req, res) => {
    res.render('travels/new');
}

const createForm = async (req, res, next) => {
    
    const travel = new Travel(req.body.travel)
    travel.author = req.user._id;
    await travel.save();
    req.flash('success', `Success! You've made a new Travel.`)
    res.redirect('/travels',)
}

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
    res.render('travels/show', {travel})
}

const editForm = async (req, res) => {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
        req.flash('error', 'Error: Travel is invalid.')
        return res.redirect('/travels')
    }
    res.render('travels/edit', {travel});
}

const updateForm = async (req, res) => {
    const travel = await Travel.findByIdAndUpdate(req.params.id, {...req.body.travel});
    if (!travel) {
        req.flash('error', 'Error: Travel is invalid.')
        return res.redirect('/travels')
    }
    req.flash('success', `Success! You've edited your Travel.`)
    res.redirect(`/travels/${travel._id}`);
}

const deleteForm = async (req, res) => {
    await Travel.findByIdAndDelete(req.params.id);
    req.flash('success', `Success! You've deleted your Travel.`)
    res.redirect('/travels')
}

// Note: cannot use new/delete as consts 
module.exports = {index, newForm, createForm, show, editForm, updateForm, deleteForm}