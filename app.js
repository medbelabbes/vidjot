const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

//Load Idea Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

// Handelbars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function (req,res,next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});


// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Idea index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Add Ideas Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Ideas Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});


// Edit Form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title,
                idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg','Video idea updated');
                    res.redirect('/ideas');
                });
        });
});


// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please add a title'});
    }

    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg','Video idea added');
                res.redirect('/ideas');
            })
    }
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg','Video idea removed');
        res.redirect('/ideas');
    })
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});