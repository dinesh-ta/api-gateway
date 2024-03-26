const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const endpointController = require('./controllers/endpointController');

const app = express();

app.use(express.json());
app.use(cors());

// Use the endpointController for handling routes
app.use('/', endpointController);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing purposes or further usage
