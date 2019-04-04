var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config/database');
var passport = require('passport');

port = process.env.PORT || 3000;

mongoose.connect(config.database);
let db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Connected to mongoDB');
});

//Check for DB errors
db.on('error', (err) => {
    console.log('error is' + err);
});

// Briing in Models
let Article = require('./models/article');

//Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//Body Parser Midlle Ware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session MiddleWare
app.use(session({
    secret: 'Keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Expres Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator MiddleWare
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Passport config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

//Home route
app.get("/", (req, res) => {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

//Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//Start Server
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});