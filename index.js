'use strict';
const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 8080;
const session = require('express-session');

// Enabling session
app.use(session({
    secret: "dev todo secret",
    resave: false,
    saveUninitialized: true,
    activeDuration: 5 * 60 * 1000
}));

//Including all the modules from server.js file
const get_modules = require('./server');

// To prevent user from using back button after session expires
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
});

db.connect((err) => {
    if(err) throw err;
    console.log('Connected to database');
});
global.db = db;

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// Routing call
app.get('/', get_modules.index);
app.post('/insert_todo', get_modules.addToDo);
app.post('/show_todo', get_modules.showToDo);
app.post('/todo-history', get_modules.todo_history);
app.get('/login', get_modules.login_page);
app.post('/login', get_modules.login_user_todo);
app.get('/logout', get_modules.logout);
app.get('/signup', get_modules.signup);
app.post('/signup', get_modules.signup_process);

app.listen(port, () => {
    console.log('Server runnig at: '+port);
});