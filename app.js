var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');

port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Connected to mongoDB');
});

//Check for DB errors
db.on('error', (req, res) => {
    console.log(err);
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

//Get Single Article
app.get('/article/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render('article', {
                article: article
            });
        }
    });
});

//Add route
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

//Add articles/add
app.post('/articles/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        console.log(article);
        Article.insertMany(article, (err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('Insert Succesfully');
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }

});

//Load edit Form
app.get('/article/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render('edit_article', {
                title: 'Edit Article',
                article: article
            });
        }
    });
});

//Update submit articles/add
app.post('/articles/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    console.log(article);
    let query = {
        _id: req.params.id
    };

    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('Update Succesfully');
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
})

app.delete('/article/:id', function (req, res) {
    let query = {
        _id: req.params.id
    };
    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

//Start Server
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});