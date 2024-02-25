const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4000;

//Making connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'professionalpractice'
});

connection.connect();

app.get('/api/data', (req,res) => {
    connection.query('SELECT * FROM locations', (error, results) => {
        if(error) throw error;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })