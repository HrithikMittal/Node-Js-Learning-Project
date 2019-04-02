var express = require('express');
var path = require('path');
const app = express();

port = process.env.PORT || 3000;

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Home route
app.get('/', (req, res) => {
    res.send("Hello World");
});

//Start Server
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});