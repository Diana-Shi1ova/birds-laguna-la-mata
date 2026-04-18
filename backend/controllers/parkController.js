const Park = require('../models/parkModel');

const getParks = async (req, res) => {
    try{
        const parks = await Park.find();
        res.status(200).json(parks);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
  getParks,
};