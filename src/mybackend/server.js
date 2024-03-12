    const express = require('express');
    const mysql = require('mysql');

    const app = express();
    const port = 4000;
    const cors = require('cors');
    const bodyParser = require("body-parser");
    const bcrypt = require('bcrypt');

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

        //Here we are configuring express to use body-parser as middle-ware
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());


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

    app.get('/api/users', (req,res) => {
        connection.query('SELECT * FROM users', (error, results) => {
            if(error) throw error;
            res.json(results);
        });
    });

    app.post('/api/menu', (req, res) => {
        console.log(req.body);
        const {name, price, description, eircode, course} = req.body;

        const query = 'INSERT INTO food (food_name, food_price, food_description, location_eircode, food_course) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [name, price, description, eircode, course], (error, results) => {
            if(error) {
                console.log('Error:', error);
                res.status(500).json({message: 'An error occured while saving data'});
            } else {
                console.log('Data saved successfully');
                res.status(200).json({message: 'Data saved successfully'});
            }   
        });
    });

    app.post('/api/users', (req, res) => {
        console.log(req.body);
        const {username, password, role, role_id} = req.body;

        const query = 'insert into users (username, password, role, role_id) VALUES (?, ? ,? ,?);'
        connection.query(query, [username, password, role, role_id], (error, results) => {
            if(error) {
                console.log('Error:', error);
                res.status(500).json({message: 'An error occured while saving data'});
            } 
            else {
                console.log('Data saved successfully');
                res.status(200).json({message: 'Data saved successfully'});
                bcrypt.hash(password, 10, (err, hash) => {
                    if(err) {
                        console.log('Error hashing password:', err);
                    } else{
                        console.log('Hashed password:',)
                    }
                })
            }   
        });
    });


    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })