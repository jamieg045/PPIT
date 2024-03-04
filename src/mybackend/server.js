const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4000;
const cors = require('cors');

//Making connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'professionalpractice'
});

connection.connect();

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });


app.get('/api/data', (req,res) => {
    connection.query('SELECT * FROM locations', (error, results) => {
        if(error) throw error;
        res.json(results);
    });
});

app.get('/api/menu', (req,res) => {
    connection.query('SELECT * FROM food', (error, results) => {
        if(error) throw error;
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })