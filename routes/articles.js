const express = require('express');
const router = express.Router();

//Bring in Article Model
let Article = require('../models/article');
// Bring User Model
let User = require('../models/user');

//Add route
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("add_article", {
        title: "Add Article"
    });
});

//Add articles/add
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
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
        article.author = req.user._id;
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
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            if (article.author != req.user._id) {
                req.flash('danger', 'Not Authorized');
                res.redirect('/');
            }
            res.render('edit_article', {
                title: 'Edit Article',
                article: article
            });
        }
    });
});

//Update submit articles/add
router.post('/edit/:id', (req, res) => {
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

router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    };
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

//Get Single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author, function (err, user) {
            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;