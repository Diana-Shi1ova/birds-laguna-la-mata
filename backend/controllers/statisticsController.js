const fs = require('fs');
const readline = require('readline');
const Bird = require('../models/birdModel');
const Statistics = require('../models/statisticsModel');
const Park = require('../models/parkModel');
const path = require("path");
const ss = require("simple-statistics");


// Años a analizar
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 5;


// Ubicación de ficheros
const sedPath = path.resolve(__dirname, "../data/SED.txt");
const ebdPath = path.resolve(__dirname, "../data/EBD.txt");

/**
 * TSV parser
 */
function parseTSVLine(line, headers) {
  const values = line.split("\t");
  const obj = {};
  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = values[i];
  }
  return obj;
}

/**
 * ISO-like week approximation
 */
function getWeek(dateStr) {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = (date - start) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff / 7);
}




function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(a));
}

function getPark(lat, lon, parks) {
    let closest = null;
    let minDist = Infinity;

    for (const park of parks) {
    const dist = haversine(lat, lon, park.lat, park.long);

    if (dist <= park.radius && dist < minDist) {
        minDist = dist;
        closest = park;
    }
    }

    return closest;
}


// Tendencia de biodiversidad
function getSpeciesRichnessTrend(data) {
  if (!data || data.length < 2) {
    return {
      direction: "unknown",
      slope: 0,
      confidence: 0,
    };
  }

  const points = data.map((d, i) => [i, d.speciesCount]);

  const regression = ss.linearRegression(points);
  const slope = regression.m;
  const line = ss.linearRegressionLine(regression);

  const r2 = ss.rSquared(points, line);

  let direction = "stable";

  if (slope > 0.1) direction = "increasing";
  else if (slope < -0.1) direction = "decreasing";

  return {
    direction,
    slope: Number(slope.toFixed(4)),
    confidence: Number(r2.toFixed(3)),
  };
}

const getParkStatistics = async (req, res) => {
  try {
    const { parkId } = req.params;
    const locale = req.query.locale ? req.query.locale : 'en';

    // Filtrado
    const filteredStats = await Statistics.find({
      parkId,
      "overall.detections": { $gt: 0 },
    }).lean();

    if (!filteredStats.length) {
      return res.status(200).json({
        totalChecklists: 0,
        totalSpecies: 0,
        top10: [],
        allSpecies: [],
      });
    }

    // Checklists
    const totalChecklists =
      filteredStats[0]?.overall?.totalChecklists || 0;


    // Rank
    const ranked = filteredStats
      .map(sp => {
        const probability = sp.overall?.probability || 0;
        const confidenceScore = sp.overall?.confidenceScore || 0;

        const score = probability * confidenceScore;

        return {
          ...sp,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Specie ids
    const topSpeciesIds = ranked.map(r => r.specieId);

    // Enriquecer de Bird collection
    const birds = await Bird.find({
      _id: { $in: topSpeciesIds },
    }).lean();
    
    const top10 = ranked.map(stat => {
      const bird = birds.find(
        b => b._id.toString() === stat.specieId.toString()
      );

      return bird;
    });

    // Idioma
    const localizedTop10 = top10.map(bird => ({
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

    // Trend
    const allSpecies = await Statistics.find({ parkId }).lean();

    const yearlySpeciesCount = {};

    for (const sp of allSpecies) {
      if (!sp.trend) continue;

      for (const t of sp.trend) {
        if (!yearlySpeciesCount[t.year]) {
          yearlySpeciesCount[t.year] = 0;
        }

        if (t.freq > 0) {
          yearlySpeciesCount[t.year] += 1;
        }
      }
    }

    const yearlySpecies = Object.entries(yearlySpeciesCount).map(
      ([year, count]) => ({
        year: Number(year),
        speciesCount: count,
      })
    );

    const trend = getSpeciesRichnessTrend(yearlySpecies);

    res.status(200).json({
      totalChecklists,
      totalSpecies: filteredStats.length,
      top10: localizedTop10,
      yearlySpecies,
      trend: trend
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSpecieStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const { parkId } = req.query;
        
        const query = {
            specieId: id
        };

        if(parkId) query.parkId = parkId;
    
        const results = await Statistics.find(query);

        res.status(200).json(results);
    } catch (error) {
            res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}




const buildSpeciesStatistics = async (req, res) => {
  try {
    console.log("Loading species...");
    const speciesList = await Bird.find().lean();

    console.log("Loading parks...");
    const parks = await Park.find().lean();

    console.log("Reading SED...");

    const sedStream = fs.createReadStream(sedPath);
    const sedRl = readline.createInterface({ input: sedStream });

    let sedHeaders = [];
    const sedMap = new Map();

    for await (const line of sedRl) {
      if (!sedHeaders.length) {
        sedHeaders = line.split("\t");
        continue;
      }

      const row = parseTSVLine(line, sedHeaders);

      const id = row["SAMPLING EVENT IDENTIFIER"];
      const dateStr = row["OBSERVATION DATE"];

      if (!id || !dateStr) continue;

      const year = new Date(dateStr).getFullYear();
      if (year < MIN_YEAR) continue;

      const lat = Number(row["LATITUDE"]);
      const lon = Number(row["LONGITUDE"]);

      const park = getPark(lat, lon, parks);
      if (!park) continue; // solo avistamientos en parques

      sedMap.set(id, {
        year,
        week: getWeek(dateStr),
        hour:
          Number((row["TIME OBSERVATIONS STARTED"] || "0:00").slice(0, 2)) || 0,

        parkId: park._id,
        parkCode: park.code,
      });
    }

    console.log("Reading EBD...");

    const ebdStream = fs.createReadStream(ebdPath);
    const ebdRl = readline.createInterface({ input: ebdStream });

    let ebdHeaders = [];
    const presenceMap = new Set();

    for await (const line of ebdRl) {
      if (!ebdHeaders.length) {
        ebdHeaders = line.split("\t");
        continue;
      }

      const row = parseTSVLine(line, ebdHeaders);

      const checklistId = row["SAMPLING EVENT IDENTIFIER"];
      const species = row["SCIENTIFIC NAME"];

      if (!checklistId || !species) continue;
      if (!sedMap.has(checklistId)) continue;

      presenceMap.add(`${checklistId}_${species}`);
    }

    console.log("Computing park-level statistics...");

    const results = [];

    for (const sp of speciesList) {
      const speciesName = sp.sciName;

      const parkAgg = {};

      for (const [checklistId, meta] of sedMap.entries()) {
        const parkKey = meta.parkCode;

        if (!parkAgg[parkKey]) {
          parkAgg[parkKey] = {
            week: {},
            hour: {},
            year: {},
            total: 0,
            detected: 0,
            parkId: meta.parkId,
            parkCode: meta.parkCode,
          };
        }

        const key = `${checklistId}_${speciesName}`;
        const present = presenceMap.has(key) ? 1 : 0;

        const p = parkAgg[parkKey];

        p.total++;
        p.detected += present;

        // WEEK
        p.week[meta.week] ??= { t: 0, d: 0 };
        p.week[meta.week].t++;
        p.week[meta.week].d += present;

        // HOUR
        p.hour[meta.hour] ??= { t: 0, d: 0 };
        p.hour[meta.hour].t++;
        p.hour[meta.hour].d += present;

        // YEAR
        p.year[meta.year] ??= { t: 0, d: 0 };
        p.year[meta.year].t++;
        p.year[meta.year].d += present;
      }

      // Guardamos para cada parque
      for (const parkCode in parkAgg) {
        const p = parkAgg[parkCode];

        const seasonality = Object.entries(p.week).map(([week, v]) => ({
          week: Number(week),
          freq: v.t ? v.d / v.t : 0,
        }));

        const hourly = Object.entries(p.hour).map(([hour, v]) => ({
          hour: Number(hour),
          freq: v.t ? v.d / v.t : 0,
        }));

        const trend = Object.entries(p.year).map(([year, v]) => ({
          year: Number(year),
          freq: v.t ? v.d / v.t : 0,
        }));

        const insights = buildInsights(
          trend,
          seasonality,
          hourly,
          p.detected
        );

        const confidence = getConfidence(p.detected);

        results.push({
          specieId: sp._id,
          speciesCode: sp.speciesCode,
          sciName: speciesName,
          comName: sp.comName,

          parkId: p.parkId,
          parkCode: p.parkCode,

          seasonality,
          hourly,
          trend,

          overall: {
            totalChecklists: p.total,
            detections: p.detected,
            probability: p.total ? p.detected / p.total : 0,
            confidence: confidence.level,
            confidenceScore: confidence.score,
          },

          insights,
        });
      }
    }

    console.log("Saving...");

    await Statistics.deleteMany({});
    await Statistics.insertMany(results);

    console.log("Done.");
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// Calcular tendencias
function getTrendInsight(trend) {
  if (!trend || trend.length < 2) {
    return { direction: "unknown", slope: 0 };
  }

  const points = trend.map(d => [d.year, d.freq]);

  const lr = ss.linearRegression(points);
  const slope = lr.m;

  let direction = "stable";
  if (slope > 0.01) direction = "increasing";
  else if (slope < -0.01) direction = "decreasing";

  return {
    direction,
    slope: Number(slope.toFixed(4)),
  };
}

function getSeasonalityInsight(seasonality) {
  if (!seasonality || !seasonality.length) {
    return { peakWeek: null, strength: 0 };
  }

  const values = seasonality.map(d => d.freq);

  const mean = ss.mean(values);
  const max = ss.max(values);

  const peakIndex = values.indexOf(max);
  const peakWeek = seasonality[peakIndex]?.week ?? null;

  const strength = mean ? max / mean : 0;

  return {
    peakWeek,
    strength: Number(strength.toFixed(2)),
  };
}

function getHourlyInsight(hourly) {
  if (!hourly || !hourly.length) {
    return { peakHour: null, morningBias: false };
  }

  const values = hourly.map(d => d.freq);

  const max = ss.max(values);
  const peakIndex = values.indexOf(max);
  const peakHour = hourly[peakIndex]?.hour ?? null;

  const morning = hourly
    .filter(d => d.hour >= 6 && d.hour < 12)
    .reduce((sum, d) => sum + d.freq, 0);

  const afternoon = hourly
    .filter(d => d.hour >= 12 && d.hour < 18)
    .reduce((sum, d) => sum + d.freq, 0);

  const morningBias = morning > afternoon;

  return {
    peakHour,
    morningBias,
  };
}

// Crear resumen
function buildInsights( trend, seasonality, hourly, totalDetections ) {
  if (totalDetections === 0) {
    return {
      hasData: false,
      trend: {
        direction: "unknown",
        slope: 0,
      },
      seasonality: {
        peakWeek: null,
        strength: 0,
      },
      hourly: {
        peakHour: null,
        morningBias: null,
      },
    };
  }

  return {
    hasData: true,
    message: null,

    trend: getTrendInsight(trend),
    seasonality: getSeasonalityInsight(seasonality),
    hourly: getHourlyInsight(hourly),
  };
}

// Fiabilidad
function getConfidence(n) {
  let level = "none";
  let score = 0;

  if (n < 10) {
    level = "none";
    score = 0;
  } else if (n < 30) {
    level = "low";
    score = 0.25;
  } else if (n < 100) {
    level = "medium";
    score = 0.5;
  } else if (n < 300) {
    level = "high";
    score = 0.75;
  } else {
    level = "very_high";
    score = 1;
  }

  return {
    level,
    score,
    n,
  };
}


module.exports = {
    buildSpeciesStatistics,
    getSpecieStatistics,
    getParkStatistics
}