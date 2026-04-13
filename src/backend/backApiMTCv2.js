import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import { verifyToken } from './auth.js';

const MONGO_URI = "mongodb+srv://martorcha_db_user:tai@clustercholstats.tygf3vi.mongodb.net/?appName=ClusterCholStats";

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log('Conectado a MongoDB Atlas'));
conn.on('error', (err) => console.error('Error conectando a MongoDB:', err));

const choleraSchema = new mongoose.Schema({
    country:        { type: String, required: true },
    year:           { type: Number, required: true },
    reportedCases:  { type: Number, required: true },
    reportedDeaths: { type: Number, required: true },
    fatalityRate:   { type: Number, required: true },
    whoRegion:      { type: String, required: true }
}, { versionKey: false });

const db = conn.model('Cholera', choleraSchema, 'cholera-stats');

let BASE_URL_API = "/api/v2";
let DOCS_URL = "https://documenter.getpostman.com/view/52370283/2sBXiesZo6";

export function loadBackendApiMTCv2(app) {

    app.get(BASE_URL_API + "/cholera-stats/docs", (req, res) => {
        res.redirect(DOCS_URL);
    });

    // GET loadInitialData
    app.get(BASE_URL_API + "/cholera-stats/loadInitialData", async (req, res) => {
        try {
            const count = await db.countDocuments();
            if (count > 0) return res.sendStatus(409);

            const csvData = [];
            let counter = 0;
            fs.createReadStream('./data/cholera_stats.csv')
                .pipe(csv())
                .on('data', (row) => {
                    if (counter < 20) {
                        csvData.push({
                            country:        row['Country'],
                            year:           parseInt(row['Year']),
                            reportedCases:  parseInt(row['Number of reported cases of cholera']),
                            reportedDeaths: parseInt(row['Number of reported deaths from cholera']),
                            fatalityRate:   parseFloat(row['Cholera case fatality rate']),
                            whoRegion:      row['WHO Region']
                        });
                        counter++;
                    }
                })
                .on('end', async () => {
                    try {
                        await db.create(csvData);
                        res.sendStatus(201);
                    } catch (err) {
                        res.sendStatus(500);
                    }
                })
                .on('error', () => res.sendStatus(500));
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // GET todos con filtros
    app.get(BASE_URL_API + "/cholera-stats", async (req, res) => {
        try {
            let datos = await db.find({}).select('-_id');

            if (req.query.country) datos = datos.filter(d => d.country === req.query.country);
            if (req.query.year) datos = datos.filter(d => d.year === parseInt(req.query.year));
            if (req.query.region) datos = datos.filter(d => d.whoRegion === req.query.region);
            if (req.query.reportedCases !== undefined) datos = datos.filter(d => d.reportedCases === parseInt(req.query.reportedCases));
            if (req.query.reportedDeaths !== undefined) datos = datos.filter(d => d.reportedDeaths === parseInt(req.query.reportedDeaths));
            if (req.query.fatalityRate !== undefined) {
                const rate = parseFloat(req.query.fatalityRate);
                datos = datos.filter(d => Math.abs(d.fatalityRate - rate) <= 0.01);
            }
            if (req.query.from || req.query.to) {
                const from = parseInt(req.query.from) || 0;
                const to = parseInt(req.query.to) || 9999;
                datos = datos.filter(d => d.year >= from && d.year <= to);
            }

            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) ?? 0;
            datos = datos.slice(offset, offset + limit);

            res.status(200).json(datos);
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // GET uno concreto
    app.get(BASE_URL_API + "/cholera-stats/:country/:year", async (req, res) => {
        try {
            const dato = await db.findOne({
                country: req.params.country,
                year: parseInt(req.params.year)
            }).select('-_id');
            if (!dato) return res.sendStatus(404);
            res.status(200).json(dato);
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // POST
    app.post(BASE_URL_API + "/cholera-stats", verifyToken, async (req, res) => {
        const { country, year, reportedCases, reportedDeaths, fatalityRate, whoRegion } = req.body;
        if (!country || year == null || reportedCases == null || reportedDeaths == null
            || fatalityRate == null || !whoRegion) {
            return res.sendStatus(400);
        }
        try {
            const existing = await db.findOne({ country, year: parseInt(year) });
            if (existing) return res.sendStatus(409);
            await db.create({ country, year: parseInt(year), reportedCases: parseInt(reportedCases),
                reportedDeaths: parseInt(reportedDeaths), fatalityRate: parseFloat(fatalityRate), whoRegion });
            res.sendStatus(201);
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // POST no permitido
    app.post(BASE_URL_API + "/cholera-stats/:country/:year", (req, res) => {
        res.sendStatus(405);
    });

    // PUT
    app.put(BASE_URL_API + "/cholera-stats/:country/:year", verifyToken, async (req, res) => {
        const { country, year, reportedCases, reportedDeaths, fatalityRate, whoRegion } = req.body;
        if (!country || year == null || reportedCases == null || reportedDeaths == null
            || fatalityRate == null || !whoRegion) {
            return res.sendStatus(400);
        }
        if (country !== req.params.country || parseInt(year) !== parseInt(req.params.year)) {
            return res.sendStatus(400);
        }
        try {
            const existing = await db.findOne({ country: req.params.country, year: parseInt(req.params.year) });
            if (!existing) return res.sendStatus(404);
            await db.updateOne(
                { country: req.params.country, year: parseInt(req.params.year) },
                { $set: { country, year: parseInt(year), reportedCases: parseInt(reportedCases),
                    reportedDeaths: parseInt(reportedDeaths), fatalityRate: parseFloat(fatalityRate), whoRegion } }
            );
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // PUT no permitido
    app.put(BASE_URL_API + "/cholera-stats", (req, res) => {
        res.sendStatus(405);
    });

    // DELETE uno
    app.delete(BASE_URL_API + "/cholera-stats/:country/:year", verifyToken, async (req, res) => {
        try {
            const existing = await db.findOne({ country: req.params.country, year: parseInt(req.params.year) });
            if (!existing) return res.sendStatus(404);
            await db.deleteOne({ country: req.params.country, year: parseInt(req.params.year) });
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    });

    // DELETE todos
    app.delete(BASE_URL_API + "/cholera-stats", verifyToken, async (req, res) => {
        try {
            await db.deleteMany({});
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    });
}