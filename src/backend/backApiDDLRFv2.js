import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import { verifyToken } from './auth.js';

const MONGO_URI = "mongodb://dandefer_db_user:admin@ac-vi8mdkd-shard-00-00.v5zket3.mongodb.net:27017,ac-vi8mdkd-shard-00-01.v5zket3.mongodb.net:27017,ac-vi8mdkd-shard-00-02.v5zket3.mongodb.net:27017/?ssl=true&replicaSet=atlas-3k2bfz-shard-0&authSource=admin&appName=aidsCluster";

const conn = mongoose.createConnection(MONGO_URI);
conn.on('connected', () => console.log('Conectado a MongoDB Atlas'));
conn.on('error', (err) => console.error('Error conectando a MongoDB:', err));


const muerteSchema = new mongoose.Schema({
    country:                        { type: String, required: true },
    codecountry:                    { type: String, required: true },
    year:                           { type: Number, required: true },
    death_count_hiv_aids_under_5:   { type: Number, required: true },
    death_count_hiv_aids_70_plus:   { type: Number, required: true },
    death_count_hiv_aids_5_14:      { type: Number, required: true },
    death_count_hiv_aids_15_49:     { type: Number, required: true },
    death_count_hiv_aids_50_69:     { type: Number, required: true }
}, { versionKey: false });

const db = conn.model('Muerte', muerteSchema, 'muertes'); 

let BASE_URL_API = "/api/v2";
let DOC_URL = "https://documenter.getpostman.com/view/52383803/2sBXiesEAR";


export function loadBackendApiDDLRFv2(app){
    app.get(BASE_URL_API+'/aids-deaths-stats/docs', (req, res) => {
        res.redirect(DOC_URL)
    })

    //GET DATOS
    app.get(BASE_URL_API+'/aids-deaths-stats', async (req, res) => {
        try {
            let muertes = await db.find({}).select('-_id').sort({ country: 1, year: 1 });

            if (req.query.codecountry) {
                muertes = muertes.filter(d => d.codecountry === req.query.codecountry);
            }
        
            if (req.query.year) {
                muertes = muertes.filter(d => d.year === parseInt(req.query.year, 10)); 
            }
            
            if (req.query.from || req.query.to) {
                const from = parseInt(req.query.from, 10) || 0;
                const to = parseInt(req.query.to, 10) || 9999;
                muertes = muertes.filter(d => d.year >= from && d.year <= to);
            }

            if(req.query.country){
                muertes = muertes.filter(d => d.country === req.query.country)
            }

            if(req.query.death_count_hiv_aids_under_5){
                muertes = muertes.filter(d => d.death_count_hiv_aids_under_5 === parseInt(req.query.death_count_hiv_aids_under_5, 10))
            }
            
            if(req.query.death_count_hiv_aids_70_plus){
                muertes = muertes.filter(d => d.death_count_hiv_aids_70_plus === parseInt(req.query.death_count_hiv_aids_70_plus, 10))
            }
            
            if(req.query.death_count_hiv_aids_5_14){
                muertes = muertes.filter(d => d.death_count_hiv_aids_5_14 === parseInt(req.query.death_count_hiv_aids_5_14, 10))
            }
            
            if(req.query.death_count_hiv_aids_15_49){
                muertes = muertes.filter(d => d.death_count_hiv_aids_15_49 === parseInt(req.query.death_count_hiv_aids_15_49, 10))
            }

            if(req.query.death_count_hiv_aids_50_69){
                muertes = muertes.filter(d => d.death_count_hiv_aids_50_69 === parseInt(req.query.death_count_hiv_aids_50_69, 10))
            }

            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            muertes = muertes.slice(offset, offset + limit);
            res.status(200).json(muertes);
        } catch(err) {
            res.sendStatus(500);
        }
    }); 
    

    //GET LOAD_INITIAL_DATA
    app.get(BASE_URL_API+'/aids-deaths-stats/loadInitialData', async (req, res) => {
        try {
            const count = await db.countDocuments();
            if (count > 0) {
                return res.sendStatus(409);
            }
            const csvData = [];
            let counter = 0;
            fs.createReadStream('./data/Age_share_death.csv')
                .pipe(csv()) 
                .on('data', (row) => {
                    if (counter < 15) {
                        csvData.push({
                            country:                        row.country,
                            codecountry:                    row.codecountry,
                            year:                           parseInt(row.year, 10),
                            death_count_hiv_aids_under_5:   parseInt(row.death_count_hiv_aids_under_5, 10),
                            death_count_hiv_aids_70_plus:   parseInt(row.death_count_hiv_aids_70_plus, 10),
                            death_count_hiv_aids_5_14:      parseInt(row.death_count_hiv_aids_5_14, 10),
                            death_count_hiv_aids_15_49:     parseInt(row.death_count_hiv_aids_15_49, 10),
                            death_count_hiv_aids_50_69:     parseInt(row.death_count_hiv_aids_50_69, 10)
                        });
                        counter++;
                    }
                })
                .on('end', async () => { 
                    try {
                        await db.create(csvData);
                        res.sendStatus(201);
                    } catch(err) {
                        res.sendStatus(500);
                    }
                });
        } catch(err) {
            res.sendStatus(500);
        }
    });

    //POST 1 ELEMENTO NUEVO A DATOS
    app.post(BASE_URL_API + '/aids-deaths-stats', verifyToken, async (req, res) => {
        let newMuertes = req.body;

        if(newMuertes.country === undefined || newMuertes.codecountry === undefined || newMuertes.year === undefined ||
            newMuertes.death_count_hiv_aids_under_5 === undefined || newMuertes.death_count_hiv_aids_70_plus === undefined ||
            newMuertes.death_count_hiv_aids_5_14 === undefined || newMuertes.death_count_hiv_aids_15_49 === undefined ||
            newMuertes.death_count_hiv_aids_50_69 === undefined){
                return res.sendStatus(400);
        }

        try {
            const existing = await db.find({ "codecountry": newMuertes.codecountry, "year": newMuertes.year });
            if(existing.length > 0) {
                return res.sendStatus(409);
            }
            await db.create(req.body);
            res.sendStatus(201);
        } catch(err) {
            res.sendStatus(500);
        }
    });

    //POST NO PERMITIDO
    app.post(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
        res.sendStatus(405);
    });

    //PUT 1 ELEMENTO
    app.put(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', verifyToken, async (req, res) => {
        let editMuerte = req.body;
        if(editMuerte.country === undefined || editMuerte.codecountry === undefined || editMuerte.year === undefined ||
                editMuerte.death_count_hiv_aids_under_5 === undefined || editMuerte.death_count_hiv_aids_70_plus === undefined ||
                editMuerte.death_count_hiv_aids_5_14 === undefined || editMuerte.death_count_hiv_aids_15_49 === undefined ||
                editMuerte.death_count_hiv_aids_50_69 === undefined){
                    return res.sendStatus(400);
            }

        try {
            const muerte = await db.find({ "codecountry": req.params.codecountry, "year": parseInt(req.params.year, 10) });
            if(muerte.length == 0) return res.sendStatus(404);
        
            if(editMuerte.codecountry !== muerte[0].codecountry || editMuerte.country !== muerte[0].country || editMuerte.year !== muerte[0].year){
                return res.sendStatus(400);
            }

            await db.updateOne(
                { "codecountry": editMuerte.codecountry, "year": parseInt(editMuerte.year, 10) }, 
                { $set: editMuerte }
            );
            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(500);
        }
    });

    //PUT NO PERMITIDO
    app.put(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
        res.sendStatus(405);
    });

    //GET 1 ELEMENTO
    app.get(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', async (req, res) => {
        try {
            const muerte = await db.findOne({ "codecountry": req.params.codecountry, "year": parseInt(req.params.year, 10) }).select('-_id');
            if(!muerte) return res.sendStatus(404);
            res.status(200).json(muerte);
        } catch(err) {
            res.sendStatus(500);
        }
    });

    //REMOVE 1 ELEMENTO 
    app.delete(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', verifyToken, async (req, res) => {
        try {
            const muerte = await db.findOne({ "codecountry": req.params.codecountry, "year": parseInt(req.params.year, 10) });
            if(!muerte) return res.sendStatus(404);
            await db.deleteOne({ "codecountry": req.params.codecountry, "year": parseInt(req.params.year, 10) });
            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(500);
        }
    });

    //REMOVE TODOS
    app.delete(BASE_URL_API + '/aids-deaths-stats', verifyToken, async (req, res) => {
        try {
            await db.deleteMany({});
            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(500);
        }
    });
}