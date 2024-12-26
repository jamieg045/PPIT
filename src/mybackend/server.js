const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const app = express();
const port = 4000;
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const stripe = require('stripe')('');
const crypto = require('crypto');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const e = require('express');
const { start } = require('repl');

const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'jamiegallagher73@yahoo.com',
        pass: ''
    }
});

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

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    console.log("Webhook Received");
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        // Validate the event with Stripe using your Webhook Secret
        event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_ZnnPgCKJUINzFXsDNCy3JwMLq65hNNIY');
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Payment for session ${session.id} was successful!`);

            // Extract transaction details
            const transactionDetails = {
                session_id: session.id,
                username: session.metadata.username || 'Unknown',
                eircode: session.metadata.eircode || 'Unknown',
                payment_status: session.payment_status,
                amount_total: session.amount_total / 100, // Convert amount from cents to euros
                currency: session.currency,
                customer_email: session.customer_details.email || 'Unknown',
                isTakeaway: session.metadata.isTakeaway === 'true', // Ensure `isTakeaway` is stored as boolean
                customer_name: session.metadata.isTakeaway === 'true' ? session.metadata.customer_name || 'Unknown' : null,
                contact_number: session.metadata.isTakeaway === 'true' ? session.metadata.contact_number || 'Unknown' : null,
                request: session.request,
            };

            console.log('Transaction details:', transactionDetails);

            // Insert into transactions table
            const query = `
                INSERT INTO transactions (session_id, username, eircode, payment_status, amount_total, currency, is_takeaway)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(query, [
                transactionDetails.session_id,
                transactionDetails.username,
                transactionDetails.eircode,
                transactionDetails.payment_status,
                transactionDetails.amount_total,
                transactionDetails.currency,
                transactionDetails.isTakeaway,
            ], (err, results) => {
                if (err) {
                    console.error('Error inserting transaction into the database:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                console.log('Transaction inserted successfully:', results);
                
                const products = JSON.parse(session.metadata.products || "[]");
                if(products.length > 0)
                {
                    const insertItemsQuery = 'INSERT INTO transaction_products (transaction_id, product_id, product_name, quantity, price, eircode) VALUES ?'
                    const itemsData = products.map(product => [
                        transactionDetails.session_id,
                        product.product_id,
                        product.name,
                        product.quantity,
                        product.price,
                        transactionDetails.eircode
                    ]);

                    connection.query(insertItemsQuery, [itemsData], (err, results ) => {
                        if(err) {
                            console.error('Error inserting transaction items into the database: ', err);
                            return res.status(500).json({success: false, message: 'Database Error'});
                        }
                        console.log('Transaction items inserted successfully', results);
                    });
                } else {
                    console.log('No products to insert for this transaction');
                }

                // Additional logic for sending receipt email
                connection.query(`SELECT LocationName, LocationAddress, Eircode, image_url FROM locations WHERE Eircode = ?`, [transactionDetails.eircode], (err, locationResults) => {
                    if (err || locationResults.length === 0) {
                        console.error('Error retrieving location details:', err || 'No location found');
                        return res.status(500).json({ success: false, message: 'Error retrieving location details' });
                    }

                    const location = locationResults[0];

                    const productDetailsHTML = products.map(product => `
                        <p><strong>Product:</strong> ${product.name}</p>
                        <p><strong>Quantity:</strong> ${product.quantity}</p>
                        <p><strong>Price:</strong> €${product.price}</p>
                    `).join('');

                    const mailOptions = {
                        from: 'jamiegallagher73@yahoo.com',
                        to: transactionDetails.customer_email,
                        subject: `Your Receipt from ${location.LocationName}`,
                        html: `
                            <h1>Thank you for calling ${location.LocationName}!</h1>
                            <p><strong>Location Address:</strong> ${location.LocationAddress}, ${location.Eircode}</p>
                            <p><img src="${location.image_url}" alt="Location Image" style="width: 100%; max-width: 300px;" /></p>
                            <h2>Transaction Details:</h2>
                            <p><strong>Amount:</strong> €${transactionDetails.amount_total}</p>
                            <h3>Products Purchased:</h3>
                            ${productDetailsHTML}
                            <h3>Total: €${transactionDetails.amount_total}</h3>
                            ${
                                transactionDetails.isTakeaway
                                    ? `<h4>Takeaway Details:</h4>
                                    <p><strong>Name:</strong> ${transactionDetails.customer_name}</p>
                                    <p><strong>Contact:</strong> ${transactionDetails.contact_number}</p>`
                                    : ''
                            }
                            <p>Thank you for visiting us!</p>
                        `
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error('Error sending receipt email:', err);
                            return res.status(500).json({ success: false, message: 'Email error' });
                        } else {
                            console.log('Receipt email sent:', info.response);
                            res.status(200).json({ success: true, message: 'Transaction saved and email sent' });
                        }
                    });
                });
            });
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
            res.json({ received: true });
    }
});


app.use(bodyParser.json());


// Retrieves all the locations on the map
app.get('/api/data', (req, res) => {
    connection.query('SELECT * FROM locations', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/api/data/:eircode', (req,res) => {
    const {eircode} = req.params;

    const query = 'SELECT * FROM locations WHERE eircode = ?';
    connection.query(query, [eircode], (error, results) => {
        if(error) {
            console.error('Database error', error);
            return res.status(500).json({success: false, message: 'Internal server error'})
        }

        if(results.length > 0)
        {
            res.json(results[0]);
        } else {
            res.status(404).json({success:false, message: 'Location not found'})
        }
    })
})

app.post('/api/data/settings', (req, res) => {
    const { locationId, takeawayBookingEnabled } = req.body;
    const query = `UPDATE locations SET takeaway_booking_enabled = ? WHERE location_id = ?`;
    db.query(query, [takeawayBookingEnabled, locationId], (err) => {
      if (err) {
        console.error('Error updating location settings:', err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  });

// Locates all the items on the food menu
app.get('/api/menu', (req, res) => {
    connection.query('select * from food order by category;', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Selects all the items on the food menu by location selected on the map
app.get('/api/menu/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'select * from food where eircode = ? order by category';
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    });
});

app.get('/api/menu/daily-specials/:eircode', (req, res) => {
    const eircode = req.params.eircode;
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    const currentTime = today.getHours();

    const query = 'SELECT p.*, d.start_date, d.end_date, d.active FROM food p LEFT JOIN daily_specials d ON p.product_id = d.food_id AND d.eircode = ? WHERE (d.start_date <= ? AND d.end_date >= ? AND d.active = TRUE) AND p.eircode = ?';

    connection.query(query, [eircode, currentDate, currentDate, eircode], (err, results) => {
        if(err) {
            console.error('Error fetching menu:', err);
            return res.status(500).json({success: false, message: 'Database error' })
        }
        
        const dailySpecials = results.filter(product => {
            const specialStartTime = 12;
            const specialEndTime = 22;
            return currentTime >= specialStartTime && currentTime < specialEndTime;
        });

        const categories = results.filter(product => !dailySpecials.includes(product));

        res.json({
            success: true,
            menu: {
                dailySpecials,
                categories
            }
        })
})
})

app.get('/api/menu/starter/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Starter" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/menu/maincourse/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Main Course" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/menu/dessert/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Dessert" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/menu/sides/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Sides" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/menu/sandwich/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Sandwich" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/menu/pizza/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM food WHERE category = "Pizza" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
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

app.get('/api/menu/check-food/:eircode', (req, res) => {
    const {eircode} = req.params;
    const query = 'SELECT COUNT(*) as count FROM food where eircode = ?';

    connection.query(query, [eircode], (err, results) => {
        if(err) {
            console.error('Error checking food menu', err);
            return res.status(500).json({success: false, message: 'Database error'});
        }
        res.json({hasFoodItems: results[0].count > 0 });
    });
});

// Retrieves the list of drinks from every location
app.get('/api/drinks', (req, res) => {
    connection.query('select * from drinks order by category;', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Retrieves the list of drinks in the selected location
app.get('/api/drinks/:eircode', (req, res) => {
    const { eircode } = req.params;
    console.log(`Fetching drinks for eircode: ${eircode}`);
    const query = 'select * from drinks where eircode = ? order by category';
    connection.query(query, [eircode], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No drinks found for this eircode' });
        }
        res.json(results);
    });
});

app.get('/api/drinks/stout/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Stout" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/lager/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Lager" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/redale/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Red Ale" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/cider/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Cider" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/ipa/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "IPA" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/beerbottle/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Beer Bottle" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/liquer/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Liquer" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/split/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Split" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/baby/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Baby" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/dashes/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Dashes" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

app.get('/api/drinks/cocktail/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'SELECT * FROM drinks WHERE category = "Cocktail" AND eircode = ? order by price'
    connection.query(query, [eircode], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    })
})

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

// Retrieves all the users registered within the application
app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    });
});

// Retrieves same data as previous
app.get('/api/login', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json(results);
    });
});

app.delete('/api/menu/item/:id', (req, res) => {
    const { id, type } = req.query; // Pass the type (food or drink) as a query parameter
    const table = type === 'drinks' ? 'drinks' : 'food';
    const query = `DELETE FROM ${table} WHERE product_id = ?`;

    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting item:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.status(200).json({ success: true, message: 'Item deleted successfully' });
        }
    });
});

app.put('/api/menu/item/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, description, category, type } = req.body;
    const table = type === 'drinks' ? 'drinks' : 'food';
    const query = `UPDATE ${table} SET name = ?, price = ?, description = ?, category = ? WHERE product_id = ?`;

    connection.query(query, [name, price, description, category, id], (err) => {
        if (err) {
            console.error('Error updating item:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.status(200).json({ success: true, message: 'Item updated successfully' });
        }
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
    const { username, email, password, role } = req.body;

    connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            console.log('Error checking username:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            console.log("Username already exists");
            return res.status(409).json({ error: 'Username or email is already taken' });
        }
        else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Password encryption error' });
                } else {
                    console.log('Hashed password:',)
                }

                const query = 'insert into users (username, password, role, email) VALUES (?, ? ,?,?);'
                connection.query(query, [username, hash, role, email], (error, results) => {
                    if (error) {
                        console.log('Error:', error);
                        res.status(500).json({ message: 'An error occured while saving data' });
                    }
                    const mailOptions = {
                        from: 'jamiegallagher73@yahoo.com',
                        to: email,
                        subject: 'Account Confirmation',
                        text: `Thank you for registering! Please confirm your account by clicking the link: http://192.168.1.1:4000/confirm?user=${username}`
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log('Error sending email', err);
                            return res.status(500).json({ success: false, message: 'Error sending email' })
                        }

                        res.status(200).json({ success: true, message: 'Registration successful! Confirmation email sent.' })
                    })
                })
            })
        }
    })
});

app.get('/confirm', (req, res) => {
    const username = req.query.user;

    connection.query('UPDATE users SET confirmed = 1 WHERE username = ?', [username], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Error confirming user' });

        res.status(200).send('Account confirmed successfully!');
    })
})

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

            if (user.confirmed !== 1) {
                return res.status(403).json({ success: false, message: 'Account not confirmed. Please check your email to confirm your account' })
            }
            const storedHashedPassword = user.password;

            bcrypt.compare(password, storedHashedPassword, (err, result) => {
                if (err) {
                    console.error('Encryption error:', err);
                    return res.status(500).json({ success: false, message: 'An error occured while processing your request' });

                }

                if (!result) {
                    return res.status(401).json({ success: false, message: 'Username or password is incorrect' });
                }

                return res.status(200).json({ success: true, message: 'Login successful', username: user.username, role: user.role, eircode: user.eircode || null });
            })
        })
})

app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: 'Email not found' })
        }

        const user = results[0];
        const token = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;

        // Log expiry time to check if it's being calculated correctly
         console.log("Reset token expiry: ", resetTokenExpiry);
         console.log("The date:" + Date.now());

        connection.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
            [token, resetTokenExpiry, email], (error) => {
                if (error) {
                    return res.status(500).json({ message: 'Error saving reset token' })
                }

                const mailOptions = {
                    from: 'jamiegallagher73@yahoo.com',
                    to: user.email,
                    subject: 'Password Reset',
                    text: `You are receiving this email because you (or someone else) have requested a password reset for your account.
                Please click the following link to reset your password: http://192.168.1.1:3000/reset-password/${token}
                If you did not request this, please ignore this email.`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    res.status(200).json({ message: 'Password reset email sent successfully' })
                });
            });
    });
});

app.post('/api/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    connection.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?',
        [token, Date.now()], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ message: 'Password reset token is invalud or has expired' });
            }

            const user = results[0];

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                connection.query('UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
                    [hashedPassword, user.id], (error) => {
                        if (error) {
                            return res.status(500).json({ message: 'Error updating password;' });

                        }
                        res.status(200).json({ message: 'Password updated successfully' });
                    }
                )
            })
        }
    )
})

app.post('/api/tables/:eircode', (req, res) => {
    const {eircode} = req.params;
    const {layout} = req.body;

    connection.query('DELETE FROM table_plan WHERE location_eircode = ?', [eircode], (error, results) => {
        if(error)
        {
            return res.status(500).json({success: false, message: 'Error deleting old tables'})
        }

        const values = layout.map((table) => [
            eircode, table.i, table.x, table.y, table.w, table.h, table.capacity, table.type
        ]);

        connection.query('INSERT INTO table_plan (location_eircode, table_id, x, y, width, height, capacity, type) VALUES ?', [values], (err) => {
           if(err) return res.status(500) .json({message: 'Error saving new table plan'})
            res.status(200).json({message: 'Table plan saved'});
        });
    });
});

app.get('/api/tables/:eircode', (req, res) => {
    const {eircode} = req.params;

    connection.query('SELECT * FROM table_plan WHERE location_eircode = ?', [eircode], (err, results) => {
        if(err) return res.status(500).json({message: 'Error retrieving table plan '})
            res.json(results);
    });
});

app.get('/api/foodcategories', (req,res) => {
    const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'food' AND COLUMN_NAME = 'category';`;
    connection.query(query, (err, results) => {
        if(err) {
            console.error('Error fetching categories', err);
            res.status(500).send('Error fetching categories');
        } else {
            const enumValues = results[0].COLUMN_TYPE.match(/enum\((.*)\)/)[1]
            .replace(/'/g, '')
            .split(',');
            res.json(enumValues);
        }
    })
})

app.get('/api/drinkcategories', (req,res) => {
    const query = `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'drinks' AND COLUMN_NAME = 'category';`;
    connection.query(query, (err, results) => {
        if(err) {
            console.error('Error fetching categories', err);
            res.status(500).send('Error fetching categories');
        } else {
            const enumValues = results[0].COLUMN_TYPE.match(/enum\((.*)\)/)[1]
            .replace(/'/g, '')
            .split(',');
            res.json(enumValues);
        }
    })
})

// app.get('/api/generate-qr/:location_eircode/:table_number', async (req, res))
// {
//     const {location_eircode, table_number} = req.params;

//     const query = 'SELECT * FROM tables WHERE location_eircode = ? AND table_number = ?';
//     connection.query(query, [location_eircode, table_number], async (error, results) => {
//         if(error) {
//             console.error('Database error:', error);
//             return res.status(500).json({success: false, message: 'Internal server error'});
//         }

//         if(results.length > 0)
//         {
//             const qrUrl = `http://192.168.1.1:3000/menu/${location_eircode}?table=${table_number}`

//             try {
//                 const qrCodeData = await QRCode.toDataURL(qrUrl);
//                 res.status(200).json({qrCode: qrCodeData});
//             } catch (err) {
//                 console.error('QR Code generation error:', err);
//                 res.status(500).json({success: false, message: 'QR code generation error'});
//             }
//         } else {
//             res.status(404).json({success: false, message: 'Table not found for this location'})
//         }
//     } )
// }

app.post('/api/daily-specials', (req, res) => {
    const { food_id, eircode, start_date, end_date} = req.body;

    if( !food_id || !eircode || !start_date || !end_date)
    {
        return res.status(400).json({success: false, message: 'All fields are required'});
    }

    const query = 'INSERT INTO daily_specials (food_id, eircode, start_date, end_date, active) VALUES (?,?,?,?,TRUE)';

    connection.query(query, [food_id, eircode, start_date, end_date], (err, results) => {
        if(err) {
            console.error('Error adding daily special', err);
            return res.status(500).json({success: false, message: 'Database error'});
        }
        res.json({success: true, message: 'Daily special set successfully'});
    } )
})

app.get('/api/manager-settings/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = `SELECT * FROM manager_settings WHERE location_eircode = ?`;
    connection.query(query, [eircode], (err, results) => {
        if (err) {
            console.error('Error fetching manager settings:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No settings found for this location' });
        }

        const settings = results[0];
        settings.slot_times = JSON.parse(settings.slot_times || '[]'); // Parse slot_times into an array
        settings.table_sizes = JSON.parse(settings.table_sizes || '[]'); // Parse table_sizes into an array

        res.status(200).json(settings);
    });
});

app.get('/api/employees/:eircode', (req, res) => {
    const { eircode } = req.params;
    const query = 'select * from users where eircode = ? AND role = Employee;';
    connection.query(query, [eircode], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/bookings', (req, res) => {
    const { location_eircode, table_size, customer_name, contact_number, booking_time, special_requirements, deposit_fee } = req.body;

    const query = `
        INSERT INTO bookings (location_eircode, table_size, customer_name, contact_number, booking_time, special_requirements, deposit_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [location_eircode, table_size, customer_name, contact_number, booking_time, special_requirements, deposit_fee], (err, results) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ success: true, booking_id: results.insertId });
    });
});

app.post('/api/bookings/confirm', (req, res) => {
    const { email, booking_details } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Booking Confirmation',
        html: `
            <h1>Your Booking Details</h1>
            <p><strong>Location:</strong> ${booking_details.location}</p>
            <p><strong>Date & Time:</strong> ${booking_details.booking_time}</p>
            <p><strong>Table Size:</strong> ${booking_details.table_size}</p>
            <p><strong>Special Requirements:</strong> ${booking_details.special_requirements || 'None'}</p>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ error: 'Email error' });
        }
        res.json({ success: true, info });
    });
});

app.post('/api/employees', (req, res) => {
    const { name, email, role, eircode } = req.body;
    const query = `INSERT INTO users (name, email, role, eircode) VALUES (?, ?, ?, ?)`;

    connection.query(query, [name, email, role, eircode], (err, result) => {
        if (err) {
            console.error('Error adding employee:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.status(200).json({ success: true, message: 'Employee added successfully', employeeId: result.insertId });
        }
    });
});

app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const query = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;

    connection.query(query, [name, email, role, id], (err) => {
        if (err) {
            console.error('Error updating employee:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.status(200).json({ success: true, message: 'Employee updated successfully' });
        }
    });
});

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM users WHERE id = ?`;

    connection.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting employee:', err);
            res.status(500).json({ success: false, message: 'Database error' });
        } else {
            res.status(200).json({ success: true, message: 'Employee deleted successfully' });
        }
    });
});


// Sends the items in the cart the user has selected to a Stripe checkout
app.post('/api/create-checkout-session', async (req, res) => {
    const { products, username, eircode } = req.body;

    console.log('Received products:', products);
    console.log('Username:', username);
    console.log('Eircode:', eircode);

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
        success_url: `http://192.168.1.1:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://192.168.1.1:3000/fail",
        metadata: {
            username: username,
            eircode: eircode,
            products: JSON.stringify(products.map(({ product_id,name, eircode, quantity, price }) => ({
                product_id,
                name,
                eircode,
                quantity,
                price
            }))).slice(0, 500) // Truncate if necessary to meet the 500-character limit
        }
    });

    console.log('Created session:', session);

    res.json({ id: session.id });
});




app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port http://0.0.0.0:${port}`)
})