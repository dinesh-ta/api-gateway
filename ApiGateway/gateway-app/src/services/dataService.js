const axios = require('axios');

async function fetchDataFromAPI(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchDataFromAPI
};
