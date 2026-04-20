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


const getParkById = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id)
        const park = await Park.findById(id);

        if(!park) res.status(404).json({message: 'Park not found'});
        res.status(200).json(park);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
  getParks,
  getParkById
};