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
    host: '192.168.1.1',
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


// Retrieves all the locations on the map
app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM locations', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Locates all the items on the food menu
app.get('/api/menu', (req, res) => {
    connection.query('select * from food order by category;', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Selects all the items on the food menu by location selected on the map
app.get('/api/menu/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'select * from food where eircode = ? order by category';
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

app.get('/api/menu/starter/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'SELECT * FROM food WHERE category = "Starter" AND eircode = ? order by price'
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    })
})

app.get('/api/menu/maincourse/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'SELECT * FROM food WHERE category = "Main Course" AND eircode = ? order by price'
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    })
})

app.get('/api/menu/dessert/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'SELECT * FROM food WHERE category = "Dessert" AND eircode = ? order by price'
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    })
})

app.get('/api/menu/sides/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'SELECT * FROM food WHERE category = "Sides" AND eircode = ? order by price'
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    })
})

// Retrieves a drink product from the drinks table by the unique ID
app.get('/api/drinks/products/:product_id', (req, res) => {
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

// Allows the food item from the food menu to be updated
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

// Retrieves the list of drinks from every location
app.get('/api/drinks', (req, res) => {
    connection.query('select * from drinks order by category;', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Retrieves the list of drinks in the selected location
app.get('/api/drinks/:eircode', (req, res) => {
    const {eircode} = req.params;
    console.log(`Fetching drinks for eircode: ${eircode}`);
    const query = 'select * from drinks where eircode = ? order by category';
    connection.query(query, [eircode], (err, results) => {
        if(err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No drinks found for this eircode' });
        }
        res.json(results);
    });
});

// Updates the drinks product based on the product id
app.put('/api/drinks/products/:product_id', async (req, res) => {
    const product_id = req.params.itemId;
    const data = req.body;
    console.log('Updated: ' + req.params.product_id);
    connection.query('UPDATE drinks SET name = ?, price = ?, description = ?, eircode = ?, category = ? where product_id = ?',
        [data.name, data.price, data.description, data.eircode, data.category, data.product_id],
        (error, results) => {
            if (error) {
                console.log("Error updating menu item:", error);
                return res.status(500).json({ success: false, message: 'Failed to update menu item' });
            }
            return res.status(200).json({ success: true, message: 'Menu item updated successfully' })
        })
})

// Gets the list of grocery shops based on location
app.get('/api/groceries/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'select * from groceries where eircode = ? order by category';
    connection.query(query, [eircode], (err, results) => {
        if(err) throw err;
        res.json(results);
    });
});

// Retrieves all the users registered within the application
app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Retrieves same data as previous
app.get('/api/login', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Sends a new product created for the food menu to the application
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

// Sends a new drink product created to the application
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

// Creates a new user and determines whether it has already registered with the app
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

// Allows the user to login to the application if they meet the required password and username 
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

// Sends the items in the cart the user has selected to a Stripe checkout
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
        success_url: `http://localhost:3000/success?session_id = {CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/fail"
    });

    console.log('Created session:', session);

    res.json({ id: session.id });
});

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        // Validate the event with Stripe using your Webhook Secret
        event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase, mark order as complete, etc.
        console.log(`Payment for session ${session.id} was successful!`);
        // Here, you can clear the cart in the database, or notify the frontend to do so
    }

    // Return a response to Stripe to acknowledge receipt of the event
    res.status(200).send('Received');
});




app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port http://0.0.0.0:${port}`)
})