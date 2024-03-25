const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

// MySQL database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gateway'
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

app.use(express.json());
app.use(cors());

// Middleware to fetch endpoints from the database
app.use(async (req, res, next) => {
    try {
        const sql = 'SELECT * FROM endpoints';
        pool.query(sql, (error, results) => {
            if (error) {
                console.error('Error fetching endpoints from database:', error);
                res.status(500).json({ error: 'Failed to fetch endpoints from database' });
            } else {
                req.endpoints = results;
                next();
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define routes using fetched data from the database
app.use((req, res, next) => {
    try {
        // Loop through fetched endpoints and define routes dynamically
        req.endpoints.forEach(endpoint => {
            // Check if the method is GET
            if (endpoint.method.toUpperCase() === 'GET') {
                app.get(endpoint.url, async (req, res) => {
                    try {
                        // Make a request to the open-source API using the base URL from the database
                        const response = await axios.get(endpoint.baseurl);
                        // Send the data from the API back to the client side
                        res.json(response.data);
                    } catch (error) {
                        // Handle errors
                        console.error('Error fetching data from API:', error);
                        res.status(500).json({ error: 'Failed to fetch data from API' });
                    }
                });
            }
        });
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
