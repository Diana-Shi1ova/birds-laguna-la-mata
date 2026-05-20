const Raspberry = require('../models/raspberryModel');
const Raspberry_Audio_Birds = require('../models/raspberryAudioBirdsModel');
const Raspberry_Image_Birds = require('../models/raspberryImageBirdsModel');


// Obtener sensores IoT
const getRaspberries = async (req, res) => {
  try {
    const { parkId, type, date, period, names } = req.query;

    const query = {};

    if (parkId) query.parkId = parkId;
    if (type) query.type = type;

    const raspberries = await Raspberry.find(query);

    const enriched = await Promise.all(
      raspberries.map(async (r) => {

        let hasDetections = false;

        // ======================
        // AUDIO
        // ======================
        if (r.type === 'audio') {

          const audioQuery = {
            raspberry: r._id
          };

          if (date) {
            audioQuery.date = date;
          }

          if (period) {
            const days = parseInt(period, 10);

            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - days);

            audioQuery.timestamp = {
              $gte: start,
              $lte: end
            };
          }

          if (names) {
            const namesArray = Array.isArray(names)
              ? names
              : names.split(',').map(n => n.trim());

            audioQuery.name_eng = {
              $in: namesArray.map(name => new RegExp(name, 'i'))
            };
          }

          const exists = await Raspberry_Audio_Birds.exists(audioQuery);
          hasDetections = !!exists;
        }

        // ======================
        // IMAGE
        // ======================
        if (r.type === 'image') {

          const imageQuery = {
            raspberry: r._id
          };

          // Fecha
          if (date) {
            imageQuery.image_name = {
              $regex: `^${date}`
            };
          }

          // Periodo
          if (period) {
            const days = parseInt(period, 10);

            const end = new Date();
            const start = new Date();

            start.setDate(end.getDate() - days);

            const formatDate = (d) => d.toISOString().slice(0, 10);

            const startStr = formatDate(start);
            const endStr = formatDate(end);

            imageQuery.image_name = {
              $gte: `${startStr}_00-00-00.jpg`,
              $lte: `${endStr}_23-59-59.jpg`
            };
          }

          if (names) {
            const namesArray = Array.isArray(names)
              ? names
              : names.split(',').map(n => n.trim());

            imageQuery.names_detected = {
              $in: namesArray.map(name => new RegExp(name, 'i'))
            };
          }

          const exists = await Raspberry_Image_Birds.exists(imageQuery);
          hasDetections = !!exists;
        }

        return {
          ...r.toObject(),
          detections: hasDetections
        };
      })
    );

    res.status(200).json(enriched);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


module.exports = {
  getRaspberries,
};