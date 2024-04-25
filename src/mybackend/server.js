const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4000;
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const stripe = require('stripe')('sk_test_51P3McW09IVIuY12X6aQ5hwfQgvKtxJhokWWLgVh5tgNhAvMFc09wfhDcXR4KT4QT3sUvAfH9evsbSsIFpeIBIzlW00R1VztgvB');

//Making connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'professionalpractice'
});

connection.connect();

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Here we are configuring express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM locations', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/menu', (req, res) => {
    connection.query('select * from food order by category;', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/drinks/:product_id', (req, res) => {
    const product_id = req.params.product_id;

    // Perform a database query to retrieve the product by its ID
    connection.query('SELECT * FROM drinks WHERE product_id = ?', [product_id], (error, results) => {
        if (error) {
            console.error('Error retrieving product:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const product = results[0];
        return res.status(200).json({ success: true, product });
    });
});

app.put('/api/menu/:product_id', async (req, res) => {
    const itemID = req.params.itemID;
    const data = req.body;
    console.log('Updated: ' + req.params.product_id);
    connection.query('UPDATE food SET name = ?, price = ?, description = ?, eircode = ?, category = ?',
        [data.name, data.price, data.description, data.eircode, data.category, itemID],
        (error, results) => {
            if (error) {
                console.log("Error updating menu item:", error);
                return res.status(500).json({ success: false, message: 'Failed to update menu item' });
            }
            return res.status(200).json({ success: true, message: 'Menu item updated successfully' })
        })
})

app.get('/api/drinks', (req, res) => {
    connection.query('select * from drinks order by category;', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.put('/api/drinks/:product_id', async (req, res) => {
    const product_id = req.params.itemId;
    const data = req.body;
    console.log('Updated: ' + req.params.product_id);
    connection.query('UPDATE drinks SET name = ?, price = ?, description = ?, eircode = ?, category = ?',
        [data.name, data.price, data.description, data.eircode, data.category, product_id],
        (error, results) => {
            if (error) {
                console.log("Error updating menu item:", error);
                return res.status(500).json({ success: false, message: 'Failed to update menu item' });
            }
            return res.status(200).json({ success: true, message: 'Menu item updated successfully' })
        })
})

app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/login', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/api/menu', (req, res) => {
    console.log(req.body);
    const { name, price, description, eircode, category } = req.body;

    const query = 'INSERT INTO food (name, price, description, eircode, category) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, price, description, eircode, category], (error, results) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'An error occured while saving data' });
        } else {
            console.log('Data saved successfully');
            res.status(200).json({ message: 'Data saved successfully' });
        }
    });
});

app.post('/api/drinks', (req, res) => {
    console.log(req.body);
    const { name, price, description, eircode, category } = req.body;

    const query = 'INSERT INTO drinks (name, price, description, eircode, category) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, price, description, eircode, category], (error, results) => {
        if (error) {
            console.log('Error:', error);
            res.status(500).json({ message: 'An error occured while saving data' });
        } else {
            console.log('Data saved successfully');
            res.status(200).json({ message: 'Data saved successfully' });
        }
    });
});

app.post('/api/users', (req, res) => {
    //console.log(req.body);
    const { username, password, role } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.log('Error checking username:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            console.log("Username already exists");
            return res.status(409).json({ error: 'Username is already taken' });
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log('Error hashing password:', err);
                } else {
                    console.log('Hashed password:',)
                }

                const query = 'insert into users (username, password, role) VALUES (?, ? ,?);'
                connection.query(query, [username, hash, role], (error, results) => {
                    if (error) {
                        console.log('Error:', error);
                        res.status(500).json({ message: 'An error occured while saving data' });
                    }
                    else {
                        console.log('Data saved successfully');
                        res.status(200).json({ message: 'Data saved successfully' });
                    }
                })
            })
        }
    })
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users where username = ?', [username],
        (error, results) => {
            if (error) {
                console.log('Database error:', error);
                return res.status(500).json({ success: false, message: 'An error occured while processing your request' })
            }

            if (results.length == 0) {
                return res.status(401).json({ success: false, message: 'Username or password is incorrect' });
            }

            const user = results[0];
            //const userPassword = user.password.toString('utf-8');
            const storedHashedPassword = user.password;

            bcrypt.compare(password, storedHashedPassword, (err, result) => {
                if (err) {
                    console.error('Encryption error:', err);
                    return res.status(500).json({ success: false, message: 'An error occured while processing your request' });

                }

                if (!result) {
                    return res.status(401).json({ success: false, message: 'Username or password is incorrect' });
                }

                return res.status(200).json({ success: true, message: 'Login successful', username: user.username, role: user.role });
            })
        })
})

app.post('/api/create-checkout-session', async (req, res) => {
    const { products } = req.body;

    console.log('Received products:', products);

    const lineItems = products.map((product) => {
        console.log('Processing product:', product);
        console.log('Product price:', product.price);
        const unitAmount = Math.round(product.price * 100);

        return {
            price_data: {
                currency: "eur",
                product_data: {
                    name: product.name,
                },
                unit_amount: unitAmount,
            },
            quantity: product.quantity
        };
    });

    console.log('Line items:', lineItems);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/menu",
        cancel_url: "http://localhost:3000/fail"
    });

    console.log('Created session:', session);

    res.json({ id: session.id });
});




app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})