var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

//EMPEZAREMOS CREANDO LA ESTRETAGIA LOCAL DE INICIO DE SESION DE USUARIO
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (req, email, password, done) {
    req.checkBody('email', 'Email is invalid').notEmpty().isEmail();
    req.checkBody('password', 'Password is Invalid').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        })

        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
            return done(null, false, { 'message': 'No user found' });
        }
        if (!user.validatePassword(password)) {
            return done(null, false, { 'message': 'Wrong password' });
        }

        return done(null, user);
    });

}));

//AHORA CREAREMOS LA ESTRATEGIA DE REGISTRO DE USUARIO
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (req, email, password, done) {
    req.checkBody('email', 'Email is invalid').notEmpty().isEmail();
    req.checkBody('password', 'Password is Invalid').notEmpty().isLength({ min: 6 });

    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        })

        return done(null, false, req.flash('error', messages));
    }

    User.findOne({ 'email': email }, (err, user) => {
        if (err) return done(err);
        if (user) {
            return done(null, false, { 'message': 'Email is already in use' });
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.hashPassword(password);
        newUser.save((err, result) => {
            if (err) return done(err);

            return done(null, newUser);
        });
    });

}));