const Bird = require('../models/birdModel');

const getBirds = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    const [birds, total] = await Promise.all([
      Bird.find()
        .sort({ taxonOrder: 1 })
        .skip(skip)
        .limit(limit),
      Bird.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      totalItems: total,
      totalPages,
      data: birds,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getBirds,
};
