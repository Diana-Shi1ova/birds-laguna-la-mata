// Obtain bird observations
const getObservations = async (req, res) => {
    try{
        const response = await fetch("https://api.ebird.org/v2/data/obs/geo/recent?lat=38.015&lng=-0.7", {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });
        const data = await response.json();
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getObservations,
}