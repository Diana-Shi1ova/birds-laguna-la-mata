// HOTSPOTS:
// Lagunas de La Mata y Torrevieja:   L3906629    38.0238218, -0.6834269
// Hondo de Elche:                    L3905205    38.1858471, -0.7809734
// Salinas de Santa Pola:             L3919198    38.194347, -0.5939913
// Albufera de Valencia:              L1121988    39.3337, -0.3225

const parks = {
  "L3906629": { // general
    name: "Lagunas de La Mata y Torrevieja",
    lat: 38.0238218,
    lng: -0.6834269,
    radius: 7
    //38.01531,-0.70111
    // L6177434, L6121785, L7241499, L6121783, L3906629
  },
  "L3905205": {
    name: "Hondo de Elche",
    lat: 38.1858471,
    lng: -0.7809734,
    radius: 7
    //38.18121,-0.75270
  },
  "L3919198": {
    name: "Salinas de Santa Pola",
    lat: 38.194347,
    lng: -0.5939913,
    radius: 7
    //38.18819,-0.61898
  },
  "L1121988": {
    name: "Albufera de Valencia",
    lat: 39.3337,
    lng: -0.3225,
    radius: 17
    //39.28032,-0.34112
  }
};


// Obtain bird observations
/*const getObservations = async (req, res) => {
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
}*/

// Obtain bird observations by Hotspot
/*const getObservations = async (req, res) => {
    const { hotspot } = req.query; // obtain Hotspot
    const url = `https://api.ebird.org/v2/data/obs/ES/recent?r=${hotspot}`; //`https://api.ebird.org/v2/data/obs/hotspot/recent?hotspotCode=${hotspot}`

    if (!hotspot) {
        return res.status(400).json({ message: 'Hotspot code is required' });
    }

    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}*/

const getObservations = async (req, res) => {
    const { hotspot } = req.query; // obtain Hotspot
    //const url = `https://api.ebird.org/v2/data/obs/ES/recent?r=${hotspot}`; //`https://api.ebird.org/v2/data/obs/hotspot/recent?hotspotCode=${hotspot}`
    if (!hotspot) {
        return res.status(400).json({ message: 'Hotspot code is required' });
    }
    const url = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${parks[hotspot].lat}&lng=${parks[hotspot].lng}&dist=${parks[hotspot].radius}&sppLocale=es`;
    //console.log(url);
    
    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
        //const filteredData = data.filter(obs => obs.locId === hotspot);
        //res.status(200).json(filteredData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Obtener avistamientos para un día concreto (desde el año 1800)
const getHistory = async (req, res) => {
    const { date } = req.query; // obtain Hotspot
    if (!date) {
        return res.status(400).json({ message: 'Hotspot code is required' });
    }
    const url = `https://api.ebird.org/v2/data/obs/ES-VC/historic/${date}`; // date en formato 2025/12/9
    //https://api.ebird.org/v2/data/obs/{{regionCode}}/historic/{{y}}/{{m}}/{{d}}
    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Obtener avistamientos para un rango de fechas
/*const getHistoryRange = async (req, res) => { //http://localhost:5000/api/eBird/history/range?start=2025-01-01&end=2025-01-10
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ message: "start and end dates are required" });
    }

    // Convertimos a Date
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
        return res.status(400).json({ message: "start date must be <= end date" });
    }

    const API_KEY = "so7u5sv82cup";
    const regionCode = "ES-VC";

    const results = [];
    let current = new Date(startDate);

    try {
        while (current <= endDate) {
            const y = current.getFullYear();
            const m = current.getMonth() + 1;
            const d = current.getDate();

            const url = `https://api.ebird.org/v2/data/obs/${regionCode}/historic/${y}/${m}/${d}`;

            console.log("Запрос:", url);

            const response = await fetch(url, {
                headers: { "X-eBirdApiToken": API_KEY }
            });

            if (!response.ok) {
                console.warn(`Ошибка eBird ${response.status} для ${url}`);
            } else {
                const dayData = await response.json();
                results.push(...dayData);
            }

            // Día siguiente
            current.setDate(current.getDate() + 1);
        }

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};*/

// Obtener avistamientos para un rango de fechas (optimizado para hacer peticiones paralelas)
const getHistoryRange = async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ message: "start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const API_KEY = "so7u5sv82cup";
    const region = "ES-VC";

    try {
        // Generamos un array de fechas
        const dates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d)); // copia
        }

        // Generamos un array de promesas
        const requests = dates.map(date => {
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const day = date.getDate();

            const url = `https://api.ebird.org/v2/data/obs/${region}/historic/${y}/${m}/${day}`;

            return fetch(url, {
                headers: { "X-eBirdApiToken": API_KEY }
            }).then(r => r.json()).catch(() => []);
        });

        // Lanzamos todo de manera paralela
        const results = await Promise.all(requests);

        // Unimos
        const flat = results.flat();

        res.status(200).json(flat);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/*const getObservations = async (req, res) => {
    //const { hotspot } = req.query; // obtain Hotspot
    //const url = `https://api.ebird.org/v2/data/obs/ES/recent?r=${hotspot}`; //`https://api.ebird.org/v2/data/obs/hotspot/recent?hotspotCode=${hotspot}`
    //if (!hotspot) {
    //    return res.status(400).json({ message: 'Hotspot code is required' });
    //}
    const { lat } = req.query;
    const { long } = req.query;
    const url = `https://api.ebird.org/v2/ref/hotspot/geo?lat=${lat}&lng=${long}`;
    console.log(url);
    
    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const textData = await response.text();

        // CSV a JSON
        const lines = textData.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',');
        const jsonData = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            return obj;
        });

        res.status(200).json(jsonData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}*/

// Species codes list of the region (Comunidad Valenciana)
/*const getSpecies = async (req, res) => {
    const API_KEY = "so7u5sv82cup";
    const region = "ES-VC";

    try {
        const url = `https://api.ebird.org/v2/product/spplist/${region}`;
        // const url = `https://api.ebird.org/v2/ref/taxonomy/ebird?species=cangoo,duskin1,brant1&fmt=json&locale=es`;
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const data = await response.json();
        const dataString = data.join(",");

        // Search common & scientific names
        const urlNames = `https://api.ebird.org/v2/ref/taxonomy/ebird?species=${dataString}&fmt=json&locale=es`;
        console.log(urlNames);
        const names = await fetch(urlNames, {
            headers: { "X-eBirdApiToken": "so7u5sv82cup" }
        });

        res.status(200).json(names);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};*/

// helper: dividir en chunks
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// Species codes list of the region (Comunidad Valenciana)
const getSpecies = async (req, res) => {
    const API_KEY = "so7u5sv82cup";
    const region = "ES-VC";
    const CHUNK_SIZE = 150; // tamaño seguro

    try {
        // 1. Obtenemos la lista de códigos de las especies
        const url = `https://api.ebird.org/v2/product/spplist/${region}`;
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": API_KEY }
        });

        if (!response.ok) {
            throw new Error(`eBird API error: ${response.status}`);
        }

        const speciesCodes = await response.json();
        console.log("Initial species count:", speciesCodes.length);


        // 2. Dividimos en chunks
        const chunks = chunkArray(speciesCodes, CHUNK_SIZE);

        // 3. Varias peticiones
        const requests = chunks.map(chunk => {
            const speciesParam = chunk.join(",");
            const urlNames =
                `https://api.ebird.org/v2/ref/taxonomy/ebird` +
                `?species=${speciesParam}&fmt=json&locale=es`;

            return fetch(urlNames, {
                headers: { "X-eBirdApiToken": API_KEY }
            }).then(r => {
                if (!r.ok) {
                    throw new Error(`Taxonomy error: ${r.status}`);
                }
                return r.json();
            });
        });

        // 4. Esperamos todas las respuestas
        const results = await Promise.all(requests);

        // 5. Unimos en un array
        const mergedResults = results.flat();
        console.log("Final taxonomy count:", mergedResults.length);

        // 6. Cogemos sciName y hacemos peticiones a Wikidata
        const scientificNames = mergedResults
            .map(s => s.sciName)
            .filter(Boolean);

        const wikidataChunks = chunkArray(scientificNames, 50);

        let wikidataMap = {};

        for (const chunk of wikidataChunks) {
            const data = await fetchWikidataData(chunk);
            wikidataMap = { ...wikidataMap, ...data };
        }

        // 7. Unimos los resultados
        const enrichedResults = mergedResults.map(species => {
            const wd = wikidataMap[species.sciName] || {};

            return {
                ...species,
                wikidata: {
                    id: wd.wikidataId || null,
                    images: wd.images || null,
                    wikipediaURL: wd.wikipediaURL || null
                }
            };
        });

        res.status(200).json(enrichedResults);

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};


async function fetchWikidataData(scientificNames) {
    const values = scientificNames
        .map(name => `"${name}"`)
        .join("\n");
    const sparql = `
        SELECT ?item ?image ?wikipediaURL ?scientificName
        WHERE {
            VALUES ?scientificName {
                ${values}
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

    // Diccionario por nombre científico
    const map = {};
    for (const row of json.results.bindings) {
        const name = row.scientificName.value;

        if (!map[name]) {
            map[name] = {
                wikidataId: row.item.value,
                images: [],
                wikipediaURL: null
            };
        }

        if (row.image) {
            const img = row.image.value;

            // Sin duplicados
            if (!map[name].images.includes(img)) {
                map[name].images.push(img);
            }
        }

        if (!map[name].wikipediaURL && row.wikipediaURL) {
            map[name].wikipediaURL = row.wikipediaURL.value;
        }
    }

    return map;
}


module.exports = {
    getObservations, // http://localhost:5000/api/eBird?hotspot=L123456
    getHistory,
    getHistoryRange,
    getSpecies
}