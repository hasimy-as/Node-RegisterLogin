//# dependencies
const session = require('express-session');
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require("mysql");
const app = express();

//# settings
//environment settings & db connect
conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodemysql"
});

conn.connect((err) => {
    if (err) throw err;
    else {
        console.log("Database connected!");
    }
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//# render, and authorization
app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/home', (req, res) => {
    res.render('homepage.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/auth_login', (req, res) => {
    var email = req.body.email,
        password = req.body.password;

    if (email && password) {
        conn.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.loggedout = false;
                req.session.email = email;
                res.redirect('/home');
            } else {
                res.json({
                    code: 400,
                    err: 'Incorrect credentials'
                });
            }
            res.end();
        });
    }
});

app.post('/auth_register', (req, res) => {
    var register_data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    conn.query('INSERT INTO user SET ?', register_data, (err, results) => {
        if (err) throw err;
        else {
            console.log('Data inserted!', results);
            res.redirect('/')
        }
    });
});

app.get('*', (req, res) => {
    res.send('404 - Page not found');
});

//# middleware port
app.listen(9090, () => {
    console.log('Port established in 9090');
});