const User = require('../models/user');

const newUser = (req, res) => {
    res.render('users/register');
};

// Note: try/catch prevents redirecting to error page without functionality
const createUser = async(req, res) => {
    try {
        const {username, password, email} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        await registeredUser.save();
        
        // Prevent having to sign on after creating new profile
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome ${username} to Travel Journey!`);
            res.redirect('/travels')
        })
        
    } catch (e) {
        req.flash('error', e.message); // REMOVE: e.message to generic message
        res.redirect('/register');
    }
};

const loginForm = (req, res) => {
    res.render('users/login');
};

const login = (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/travels'
    delete req.session.returnTo
    res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
    wasLoggedIn = req.isAuthenticated();
    req.logout((err) => { // Function provided by passport 
        if (err) { 
            next(error);
        } else if (wasLoggedIn) {
            req.flash('success', 'Successfully logged out!');
        }
        res.redirect('/login'); 
    })
};

const account = (req, res) => {
    res.render('users/account')
}

const deleteAccount = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    wasLoggedIn = req.isAuthenticated();
    req.logout(async (err) => { // Function provided by passport 
        if (err) { 
            next(error);
        } else if (wasLoggedIn) {
            req.flash('success', `Success! You've deleted your account.`);
        }
        res.redirect('/login'); 
    })

}

module.exports = {newUser, createUser, loginForm, login, logout, account, deleteAccount};