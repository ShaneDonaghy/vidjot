const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Load Routes - this is required because we moved all the /ideas functions to ideas.js. This will link them
const ideas = require('./routes/ideas');
const users = require('./routes/users');

/*Back ticks in the console.log function below allow for
variables to be used without concatenation as long as
they have the dollar sign and curly braces

in the app.listen function the second argument is a callback
function denoted in arrows (arrow functions). This is the syntax
of ES6. writing it as funtion(){}; is also allowed
*/

/*How middleware works:
Has access to all requests/responses coming through the app
for example the logging of the date.now happens on ALL pages.
Next() is essentially a continue command.

app.use(function(req,res,next){
  console.log(Date.now());
  req.name = 'Shane Donaghy';
  next();
});
*/

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Handlebars middleware (most plugins we use, use middleware)
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')))

// Method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//flash middleware 
app.use(flash());

//Global Variables for flash. Declaring here so they can be used anywhere and everywhere in the app. 
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); //i.e. next bit of middleware
});

/*Index ROUTE.
This tell the browser to GET the home URL i.e. localhost:5000/
*/
app.get('/', (req, res) => {
    const title = 'WELCOME EVERYONE';
    res.render('index', {
        title: title
    });
});

/*
About ROUTE.
This will tell the browser to go to the about page
*/
app.get('/about', (req,res) => {
  res.render('about');
});


//USE the loaded routes (top of this file)
app.use('/ideas', ideas);
app.use('/users', users);


const port = 5000;
app.listen(port, () =>{
  console.log(`Server started on port: ${port}`);
});
