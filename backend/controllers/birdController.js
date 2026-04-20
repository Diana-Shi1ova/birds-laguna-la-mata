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

const getBirdById = async (req, res) => {
  try {
    const { id } = req.params;
        
    const result = await Bird.findById(id);
    if(!result) res.status(404).json({'message': 'Bird not found'});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Obtener foto de Wikidata
const getWikidata = async (req, res) => {
  const { sciName } = req.query;

  try {
    const sparql = `
        SELECT ?item ?image ?wikipediaURL ?scientificName
        WHERE {
            VALUES ?scientificName {
                "${sciName}"
            }

            ?item p:P31 ?statement0.
            ?statement0 (ps:P31/(wdt:P279*)) wd:Q16521.
            ?item p:P225 ?statement1.
            ?statement1 (ps:P225) ?scientificName.

            OPTIONAL { ?item wdt:P18 ?image. }
            
            OPTIONAL {
                ?wikipediaURL schema:about ?item;
                        schema:isPartOf <https://es.wikipedia.org/>.
            }

            SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
        }
    `;

    console.log(sparql);

    const url =
        "https://query.wikidata.org/sparql?format=json&query=" +
        encodeURIComponent(sparql);

    const response = await fetch(url, {
        headers: {
            "Accept": "application/sparql+json",
            "User-Agent": "Avistory/1.0"
        }
    });

    if (!response.ok) {
        throw new Error("Wikidata query failed");
    }

    const json = await response.json();
    const bindings = json.results.bindings;

    if (!bindings.length) {
      return res.status(404).json({
        message: "Species not found"
      });
    }

    const first = bindings[0];

    const result = {
      sciName: first.scientificName?.value || sciName,
      wikipediaURL: first.wikipediaURL?.value || null,
      images: bindings
        .map(b => b.image?.value)
        .filter(Boolean)
    };

    result.images = [...new Set(result.images)];

    res.status(200).json(result);
  } catch (error){
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}

module.exports = {
  getBirds,
  getWikidata,
  getBirdById
};
