const Raspberry_Audio_Birds = require('../models/raspberryAudioBirdsModel');
const Raspberry_Image_Birds = require('../models/raspberryImageBirdsModel');
const Raspberry = require('../models/raspberryModel');


// Obtener detecciones realizadas por imágen
const getObservationsAudio = async (req, res) => {
  try {
    const query = buildAudioQuery({
      ids: req.params.id,
      ...req.query
    });

    const obs = await Raspberry_Audio_Birds
      .find(query)
      .sort({ timestamp: -1 });

    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Obtener detecciones realizadas por imágen
const getObservationsImage = async (req, res) => {
  try {
    const query = buildImageQuery({
      ids: req.params.id,
      ...req.query
    });

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


// Calcular resultados de búsqueda
const getNumResults = async (req, res) => {
  try {
    const { parkId } = req.params;
    const type = req.query.type;

    if (!parkId) {
      return res.status(400).json({ message: 'parkId is required' });
    }

    // Obtener todos Raspberries del parque
    const raspberries = await Raspberry.find({ parkId: parkId }).select('_id');

    const ids = raspberries.map(r => r._id);

    if (ids.length === 0) {
      return res.status(200).json({ total: 0 });
    }

    const params = {
      ids,
      ...req.query
    };

    let total = 0;

    // Calcular por tipo
    if (!type || type === 'audio') {
      const audioQuery = buildAudioQuery(params);
      const audioCount = await Raspberry_Audio_Birds.countDocuments(audioQuery);
      total += audioCount;
    }

    if (!type || type === 'image') {
      const imageQuery = buildImageQuery(params);
      const imageCount = await Raspberry_Image_Birds.countDocuments(imageQuery);
      total += imageCount;
    }

    res.status(200).json({ total });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// Parsing de nombres
const parseNames = (names) => {
  if (!names) return null;

  const arr = Array.isArray(names)
    ? names
    : names.split(',').map(n => n.trim()).filter(Boolean);

  if (arr.length === 0) return null;

  return arr.map(name => new RegExp(name, 'i'));
};


// Construir petición de búsqueda para raspberries de audio
const buildAudioQuery = ({ ids, date, period, names }) => {
  const query = {
    raspberry: { $in: ids }
  };

  const regexNames = parseNames(names);

  if (regexNames) {
    query.name_eng = { $in: regexNames };
  }

  if (date) {
    query.date = date;
  }

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

  return query;
};


// Construir petición de búsqueda para raspberries de imágen
const buildImageQuery = ({ ids, date, period, names }) => {
  const query = {
    raspberry: { $in: ids }
  };

  const regexNames = parseNames(names);

  if (regexNames) {
    query.names_detected = { $in: regexNames };
  }

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

    imageNameFilter.$gte = `${formatDate(start)}_00-00-00.jpg`;
    imageNameFilter.$lte = `${formatDate(end)}_23-59-59.jpg`;
  }

  if (Object.keys(imageNameFilter).length > 0) {
    query.image_name = imageNameFilter;
  }

  return query;
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
  getObservationsImage,
  getNumResults
};