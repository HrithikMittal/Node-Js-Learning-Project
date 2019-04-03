var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
const app = express();
var bodyParser = require('body-parser');

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

//Add route
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

app.post('/articles/add', (req, res) => {
    let article = new Article;
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    console.log(article);
    Article.save(article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('Insert Succesfully');
            res.redirect('/');
        }
    });
})


//Start Server
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});