const DEFAULT_LOCALE = 'es';
const Park = require('../models/parkModel');
const Bird = require('../models/birdModel');


const languages = ['es', 'en', 'ru'];

// Calcular distancia para ajustes dentro del radio
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const x = (lon2 - lon1) * Math.cos((lat1 + lat2) * Math.PI / 360);
    const y = lat2 - lat1;
    return Math.sqrt(x * x + y * y) * 111;
}


const getObservations = async (req, res) => {
    const { parkId, back, locale} = req.query; // obtain Hotspot
    let lang = locale;
    
    if (!parkId) return res.status(400).json({ message: 'parkId code is required' });
    if(!lang) lang = DEFAULT_LOCALE;

    const park = await Park.findById(parkId);

    const url = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${park.lat}&lng=${park.long}&dist=${park.radius}&sppLocale=${lang}&back=${back}`;
    
    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": process.env.EBIRD_TOKEN }
        });

        if (!response.ok) {
            res.status(504).json({ message: `eBird API error: ${response.status}` });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Obtener avistamientos para un día concreto (desde el año 1800)
const getHistory = async (req, res) => {
    try {
        const { date, locale, parkId } = req.query; // obtain Hotspot
        let lang = locale;
        if (!date) return res.status(400).json({ message: 'Date code is required' });
        if(!lang) lang = DEFAULT_LOCALE;
        if(!parkId) return res.status(400).json({ message: 'parkId is required' });

        const park = await Park.findById(parkId);

        const url = `https://api.ebird.org/v2/data/obs/${park.region_code}/historic/${date}?sppLocale=${lang}`; // date en formato 2025/12/9
        
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": process.env.EBIRD_TOKEN }
        });

        if (!response.ok) {
            res.status(504).json({ message: `eBird API error: ${response.status}` });
        }

        const data = await response.json();

        // Filtrado de resultados por radio
        const latDelta = park.radius / 111;
        const lngDelta = park.radius / (111 * Math.cos(park.lat * Math.PI / 180));

        const filtered = data.filter(obs => {
            if (
                obs.lat < park.lat - latDelta ||
                obs.lat > park.lat + latDelta ||
                obs.lng < park.long - lngDelta ||
                obs.lng > park.long + lngDelta
            ) return false;

            const distance = getDistanceKm(park.lat, park.long, obs.lat, obs.lng);
            return distance <= park.radius;
        });

        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// SOLO PRUEBA
// Obtener avistamientos para un rango de fechas (optimizado para hacer peticiones paralelas)
const getHistoryRange = async (req, res) => {
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ message: "start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const API_KEY = process.env.EBIRD_TOKEN;
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

// helper: dividir en chunks
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

// Adicional
// Species codes list of the region (Comunidad Valenciana)
const getSpecies = async (req, res) => {
    const region = "ES-VC";
    const CHUNK_SIZE = 150; // tamaño seguro

    try {
        // 1. Obtenemos la lista de códigos de las especies
        const url = `https://api.ebird.org/v2/product/spplist/${region}`;
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": process.env.EBIRD_TOKEN }
        });

        if (!response.ok) {
            if (!response.ok) { res.status(504).json({message: `eBird API error (specie codes): ${response.status}`});}
        }

        const speciesCodes = await response.json();
        console.log("Initial species count:", speciesCodes.length);


        // 2. Dividimos en chunks
        const chunks = chunkArray(speciesCodes, CHUNK_SIZE);

        // 3. Varias peticiones
        const requests = chunks.map(async chunk => {
            const speciesParam = chunk.join(",");

            const localeResponses = await Promise.all(
                languages.map(async locale => {
                    const url =
                        `https://api.ebird.org/v2/ref/taxonomy/ebird` +
                        `?species=${speciesParam}&fmt=json&locale=${locale}`;

                    const r = await fetch(url, {
                        headers: {
                            "X-eBirdApiToken": process.env.EBIRD_TOKEN
                        }
                    });

                    if (!r.ok) {
                        throw new Error(`taxonomy ${locale}: ${r.status}`);
                    }

                    const data = await r.json();

                    return { locale, data };
                })
            );

            // Juntamos idiomas
            const map = {};

            for (const { locale, data } of localeResponses) {
                data.forEach(item => {
                    if (!map[item.speciesCode]) {
                        map[item.speciesCode] = {
                            speciesCode: item.speciesCode,
                            sciName: item.sciName,
                            comName: {}
                        };
                    }

                    map[item.speciesCode].comName[locale] = item.comName;
                });
            }

            return Object.values(map);
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
        if (err.code === "WIKIDATA_ERROR") {
            return res.status(504).json({
                message: "Wikidata unavailable",
                error: err.message
            });
        }

        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};


// Obtener datos de Wikidata
async function fetchWikidataData(scientificNames) {
    const values = scientificNames
        .map(name => `"${name}"`)
        .join("\n");

    // Recolectamos OPTIONALS para diferentes idiomas
    // SELECT
    const selectWikiVars = languages
        .map(lang => `?wikipediaURL_${lang}`)
        .join(" ");

    // OPTIONALS
    const wikiOptionalBlocks = languages
        .map(lang => {
            const urlVar = `?wikipediaURL_${lang}`;
            // const domain = languageDomains[lang];
            const domain = `https://${lang}.wikipedia.org/`

            return `
            OPTIONAL {
                ${urlVar} schema:about ?item;
                        schema:isPartOf <${domain}>.
            }
            `;
        })
        .join("\n");

    const sparql = `
        SELECT ?item ?image ?scientificName ${selectWikiVars}
        WHERE {
            VALUES ?scientificName {
                ${values}
            }

            ?item p:P31 ?statement0.
            ?statement0 (ps:P31/(wdt:P279*)) wd:Q16521.
            ?item p:P225 ?statement1.
            ?statement1 (ps:P225) ?scientificName.

            OPTIONAL { ?item wdt:P18 ?image. }
            
            ${wikiOptionalBlocks}

            SERVICE wikibase:label { bd:serviceParam wikibase:language "${languages.join(",")}". }
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
        const error = new Error(`Wikidata error: ${response.status}`);
        error.code = "WIKIDATA_ERROR";
        throw error;
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
                wikipediaURL: {}
            };
        }

        if (row.image) {
            const img = row.image.value;

            // Sin duplicados
            if (!map[name].images.includes(img)) {
                // Obtener datos de Wikimedia commons

                map[name].images.push(img);
            }
        }

        for (const lang of languages) {
            const key = `wikipediaURL_${lang}`;

            const url = row[key]?.value;

            if (url) {
                const langMatch = url.match(/https:\/\/([a-z]+)\.wikipedia\.org/);

                if (langMatch) {
                    const lang = langMatch[1];
                    map[name].wikipediaURL[lang] = url;
                }
            }
        }
    }

    return map;
}


// Avistamientos recientes por especies
const getSpecieObservations = async (req, res) => {
    const { specieId } = req.params;
    const { back, parkId, locale } = req.query; // obtain Hotspot

    let lang = locale;
    let days = 1;

    if (!parkId) return res.status(400).json({ message: 'parkId code is required' });
    if(!lang) lang = DEFAULT_LOCALE;
    if (back) days = back;

    const park = await Park.findById(parkId);
    const specie = await Bird.findById(specieId);

    const url = `https://api.ebird.org/v2/data/obs/${park.region_code}/recent/${specie.speciesCode}?sppLocale=${DEFAULT_LOCALE}&back=${days}`;
    
    try {
        const response = await fetch(url, {
            headers: { "X-eBirdApiToken": process.env.EBIRD_TOKEN }
        });

        if (!response.ok) { res.status(504).json({message: `eBird API error: ${response.status}`});}

        const data = await response.json();

        // Filtrado de resultados por radio
        const latDelta = park.radius / 111;
        const lngDelta = park.radius / (111 * Math.cos(park.lat * Math.PI / 180));

        const filtered = data.filter(obs => {
            if (
                obs.lat < park.lat - latDelta ||
                obs.lat > park.lat + latDelta ||
                obs.lng < park.long - lngDelta ||
                obs.lng > park.long + lngDelta
            ) return false;

            const distance = getDistanceKm(park.lat, park.long, obs.lat, obs.lng);
            return distance <= park.radius;
        });

        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}



module.exports = {
    getObservations,
    getHistory,
    getHistoryRange,
    getSpecies,
    getSpecieObservations
}