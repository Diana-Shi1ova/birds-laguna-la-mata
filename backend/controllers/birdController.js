const Bird = require('../models/birdModel');
const { createFlexibleRegex } = require('../utils/charUtil');

const hybrid = {
  'es': '(híbrido)',
  'en': '(hybrid)',
  'ru': '(гибрид)'
}
const excluded = ["(híbrido)", "(hybrid)", "(гибрид)"];


const getBirds = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const name = req.query.name?.trim();
    const locale = req.query.locale ? req.query.locale : 'en';

    const skip = (page - 1) * limit;

    let filter = {
      [`comName.${locale}`]: { $not: new RegExp(excluded.join("|"), "i") }
    };

    if (name) {
      filter.$and = [
        { [`comName.${locale}`]: { $not: new RegExp(excluded.join("|"), "i") } },
        {
          $or: [
            { [`comName.${locale}`]: { $regex: createFlexibleRegex(name), $options: "i" } },
            { sciName: { $regex: createFlexibleRegex(name), $options: "i" } }
          ]
        }
      ];
    }

    const [birds, total] = await Promise.all([
      Bird.find(filter)
        .sort({ taxonOrder: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Bird.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    // idiomas
    /*const updatedBirds = birds.map(bird => ({
      ...bird,
      comName: bird.comName[locale],
      'wikidata.wikipediaURL': wikidata.wikipediaURL[locale]
    }));*/

    const updatedBirds = birds.map(bird => ({
      ...bird,

      comName:
        bird.comName?.[locale] ||
        bird.comName?.en ||
        null,

      wikidata: {
        ...(bird.wikidata || {}),
        wikipediaURL:
          bird.wikidata?.wikipediaURL?.[locale] ||
          bird.wikidata?.wikipediaURL?.en ||
          null
      }
    }));

    res.status(200).json({
      page,
      limit,
      totalItems: total,
      totalPages,
      data: updatedBirds,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Normalizar (eliminar é,ó,á,ú,í,ü ect.)
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const getBirdById = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = req.query.locale ? req.query.locale : 'en';
        
    const result = await Bird.findById(id).lean();
    if(!result) res.status(404).json({'message': 'Bird not found'});

    // Idioma
    const localized = {
      ...result,

      comName:
        result.comName?.[locale] ||
        result.comName?.en ||
        null,

      wikidata: {
        ...(result.wikidata || {}),
        wikipediaURL:
          result.wikidata?.wikipediaURL?.[locale] ||
          result.wikidata?.wikipediaURL?.en ||
          null
      }
    };

    res.status(200).json(localized);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Obtener foto de Wikidata
const getDirectWikidata = async (req, res) => {
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

// Obtener foto de Wikidata
const getWikidata = async (req, res) => {
  const { sciName } = req.query;

  try {
    const result = await Bird.findOne({sciName: sciName});
    if(!result) res.status(404).json({'message': 'Bird not found'});

    const filteredResult = {
      sciName: sciName,
      id: result._id,
      wikipediaURL: result.wikidata.wikipediaURL,
      images: result.wikidata.images
    };

    res.status(200).json(filteredResult);
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
