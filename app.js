const express = require('express');
const exphbs = require('express-handlebars');
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

// Add Ideas Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});