const Raspberry_Audio_Birds = require('../models/raspberryAudioBirdsModel');
const Raspberry_Image_Birds = require('../models/raspberryImageBirdsModel');


/*const getObservationsAudio = async (req, res) => {
  try {
    const { date, period, names } = req.query;

    const query = {};

    // Filtrado por nombres
    if (names) {
      const namesArray = Array.isArray(names)
        ? names
        : names.split(',');

      query.name_eng = { $in: namesArray };
    }

    // Filtrado por fecha (YYYY-MM-DD)
    if (date) {
      query.date = date;
    }

    // Filtrado por período (últimos 1-30 días)
    if (period) {
      const days = parseInt(period, 10);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      query.timestamp = {
        $gte: start,
        $lte: end
      };
    }

    const obs = await Raspberry_Audio_Birds.find(query).sort({ timestamp: -1 });

    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};*/

const getObservationsAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, period, names } = req.query;

    const query = {
      raspberry: id
    };

    // Filtrado por nombres
    /*if (names) {
      const namesArray = Array.isArray(names)
        ? names
        : names.split(',');

      query.name_eng = { $in: namesArray };
    }*/
    // 🔹 1. NAMES: partial match (ANY of them)
    if (names) {
      const namesArray = Array.isArray(names)
        ? names
        : names.split(',').map(n => n.trim());

      query.name_eng = {
        $in: namesArray.map(name => new RegExp(name, 'i'))
      };
    }

    // Filtrado por fecha (YYYY-MM-DD)
    if (date) {
      query.date = date;
    }

    // Filtrado por período (últimos 1-30 días)
    if (period) {
      const days = parseInt(period, 10);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      query.timestamp = {
        $gte: start,
        $lte: end
      };
    }

    const obs = await Raspberry_Audio_Birds
      .find(query)
      .sort({ timestamp: -1 });

    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/*const getObservationsImage = async (req, res) => {
    try{
        const obs = await Raspberry_Images.find();
        res.status(200).json(obs);
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/

/*const getObservationsImage = async (req, res) => {
  try {
    const { date, period, species } = req.query;

    const query = {};

    // Filtrado por especie
    if (species) {
      const speciesArray = Array.isArray(species)
        ? species
        : species.split(',');

      query.species_detected = { $in: speciesArray };
    }

    // Filtrado por fecha
    if (date) {
      query.image_name = {
        $regex: `^${date}`
      };
    }

    // Filtrado por período
    if (period) {
      const days = parseInt(period, 10);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      const formatDate = (d) => d.toISOString().slice(0, 10);

      const startStr = formatDate(start);
      const endStr = formatDate(end);

      query.image_name = {
        $gte: `${startStr}_00-00-00.jpg`,
        $lte: `${endStr}_23-59-59.jpg`
      };
    }

    const obs = await Raspberry_Image_Birds.find(query).sort({ image_name: -1 });

    res.status(200).json(obs);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};*/


const getObservationsImage = async (req, res) => {
  try {
    const { date, period, names } = req.query;
    const { id } = req.params;

    const query = {
      raspberry: id
    };

    // 🔹 1. NAMES: partial match (ANY of them)
    if (names) {
      const namesArray = Array.isArray(names)
        ? names
        : names.split(',').map(n => n.trim());

      query.names_detected = {
        $in: namesArray.map(name => new RegExp(name, 'i'))
      };
    }

    // 🔹 2. DATE + PERIOD (combined safely)
    const imageNameFilter = {};

    if (date) {
      imageNameFilter.$gte = `${date}_00-00-00.jpg`;
      imageNameFilter.$lte = `${date}_23-59-59.jpg`;
    }

    if (period) {
      const days = parseInt(period, 10);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      const formatDate = (d) => d.toISOString().slice(0, 10);

      const startStr = formatDate(start);
      const endStr = formatDate(end);

      imageNameFilter.$gte = `${startStr}_00-00-00.jpg`;
      imageNameFilter.$lte = `${endStr}_23-59-59.jpg`;
    }

    // apply only if something exists
    if (Object.keys(imageNameFilter).length > 0) {
      query.image_name = imageNameFilter;
    }

    const obs = await Raspberry_Image_Birds
      .find(query)
      .sort({ image_name: -1 });

    res.status(200).json(obs);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// Auxilar: devolver listado de nombres sin repeticiones
const getObservationsNamesAudio = async (req, res) => {
    try {
        const uniqueNames = await Raspberry_Audio_Birds.distinct("name_eng");
        res.json(uniqueNames.filter(Boolean));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  getObservationsAudio,
  getObservationsNamesAudio,
  getObservationsImage
};