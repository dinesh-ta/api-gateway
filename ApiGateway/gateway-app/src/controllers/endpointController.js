const express = require('express');
const fetchEndpointsMiddleware = require('../middlewares/fetchEndpointsMiddleware');
const DataService = require('../services/dataService');

const app = express();

app.use(fetchEndpointsMiddleware);

// Define routes using fetched data from the database
app.use((req, res, next) => {
    try {
        // Loop through fetched endpoints and define routes dynamically
        req.endpoints.forEach(endpoint => {
            // Check if the method is GET
            if (endpoint.method.toUpperCase() === 'GET') {
                app.get(endpoint.url, async (req, res) => {
                    try {
                        // Fetch data from the API using the base URL from the database
                        const data = await DataService.fetchDataFromAPI(endpoint.baseurl);
                        // Send the data from the API back to the client side
                        res.json(data);
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

// Route to concatenate responses from all endpoints in the database
app.get('/concat/all', async (req, res) => {
    try {
        let concatenatedData = [];

        // Loop through fetched endpoints
        for (const endpoint of req.endpoints) {
            // Check if the method is GET
            if (endpoint.method.toUpperCase() === 'GET') {
                try {
                    // Fetch data from the API using the base URL from the database
                    const data = await DataService.fetchDataFromAPI(endpoint.baseurl);
                    // Concatenate the data to the result array
                    concatenatedData = concatenatedData.concat(data);
                } catch (error) {
                    // Handle errors for individual API requests
                    console.error(`Error fetching data from API for URL ${endpoint.baseurl}:`, error);
                }
            }
        }

        // Send the concatenated data back to the client side
        res.json(concatenatedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;
