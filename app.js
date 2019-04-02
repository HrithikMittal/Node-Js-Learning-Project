var express = require('express');
var path = require('path');
const app = express();

port = process.env.PORT || 3000;

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home route
app.get('/', (req, res) => {
    let articles = [{
        id: 1,
        title: 'Article One',
        author: 'Brad Traversy',
        body: 'This is a article one'
    }, {
        id: 2,
        title: 'Article two',
        author: 'Brad Traversy',
        body: 'This is a article two'
    }, {
        id: 3,
        title: 'Article three',
        author: 'Brad Traversy',
        body: 'This is a article three'
    }, ]
    res.render('index', {
        title: 'Hello',
        articles: articles
    });
});

//Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//Start Server
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});