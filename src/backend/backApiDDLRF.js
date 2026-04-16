import fs from 'fs';
import csv from 'csv-parser';
import dataStore from 'nedb';
let db = new dataStore({ filename: './data/db/aids-deaths-stats.db', autoload: true });
let BASE_URL_API = "/api/v1";
let DOC_URL = "https://documenter.getpostman.com/view/52383803/2sBXiesEAR";


export function loadBackendApiDDLRF(app){
    app.get(BASE_URL_API+'/aids-deaths-stats/docs', (req, res) => {
        res.redirect(DOC_URL)
    })

    let arrayMuertes = [];
    db.insert(arrayMuertes);

    //GET DATOS
    app.get(BASE_URL_API+'/aids-deaths-stats', (req, res) => {
        
        db.find({}).sort({ country: 1, year: 1 }).exec((err, muertes) => {
            if(err) return res.sendStatus(500);
            
            muertes = muertes.map((c) => { delete c._id; return c });

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
            res.status(200, "OK").send(JSON.stringify(muertes)); 
        });

    }); 
    

    //GET LOAD_INITIAL_DATA
    app.get(BASE_URL_API+'/aids-deaths-stats/loadInitialData', (req,res) => {
        db.find({}, (err, muertes) => {
            if (muertes.length > 0) {
                return res.sendStatus(409, "CONFLICT");
            }
            let counter = 0;
            const csvData = [];
            fs.createReadStream('./data/Age_share_death.csv')
                .pipe(csv()) 
                .on('data', (row) => {
                    if (counter < 6330) {
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
                .on('end', () => { 
                    db.insert(csvData, (err, inserted) => {
                        if(err) return res.sendStatus(500)
                        res.sendStatus(201, "CREATED")});
                });
        });
        
    });

    //POST 1 ELEMENTO NUEVO A DATOS
    app.post(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
        let newMuertes = req.body;

        if(newMuertes.country === undefined || newMuertes.codecountry === undefined || newMuertes.year === undefined ||
            newMuertes.death_count_hiv_aids_under_5 === undefined || newMuertes.death_count_hiv_aids_70_plus === undefined ||
            newMuertes.death_count_hiv_aids_5_14 === undefined || newMuertes.death_count_hiv_aids_15_49 === undefined ||
            newMuertes.death_count_hiv_aids_50_69 === undefined){
                return res.sendStatus(400, "BAD REQUEST");
        }

        db.find({"codecountry": newMuertes.codecountry, "year": newMuertes.year}, (err,muertes) => 
        {if(muertes.length > 0){ 
            res.sendStatus(409, "CONFLICT")
        } else {
            db.insert(req.body, (err, inserted) => {
                        if(err) return res.sendStatus(500)
                        res.sendStatus(201, "CREATED")});
        }})
    });

    //POST NO PERMITIDO
    app.post(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED")
        
    });

    //PUT 1 ELEMENTO
    app.put(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
        let editMuerte = req.body;
        if(editMuerte.country === undefined || editMuerte.codecountry === undefined || editMuerte.year === undefined ||
                editMuerte.death_count_hiv_aids_under_5 === undefined || editMuerte.death_count_hiv_aids_70_plus === undefined ||
                editMuerte.death_count_hiv_aids_5_14 === undefined || editMuerte.death_count_hiv_aids_15_49 === undefined ||
                editMuerte.death_count_hiv_aids_50_69 === undefined){
                    return res.sendStatus(400, "BAD REQUEST");
            }

        db.find({"codecountry": req.params.codecountry, "year": parseInt(req.params.year,10)}, (err,muerte) =>{
            if(muerte.length == 0) return res.sendStatus(404, "NOT FOUND");
        
            if(editMuerte.codecountry !== muerte[0].codecountry || editMuerte.country !== muerte[0].country || editMuerte.year !== muerte[0].year){
                return res.sendStatus(400,"BAD REQUEST")
            }

            db.update(
                { "codecountry": editMuerte.codecountry, "year": parseInt(editMuerte.year, 10) }, 
                { $set: editMuerte }, 
                {}, 
                (err, numReplaced) => {
                    if(err) return res.sendStatus(500);
                    res.sendStatus(200, "OK");
                }
            );
        });
        
        
    });

    //PUT NO PERMITIDO
    app.put(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
        res.sendStatus(405, "METHOD NOT ALLOWED")
    });



    //GET 1 ELEMENTO
    app.get(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
        
        db.find({"codecountry": req.params.codecountry, "year": parseInt(req.params.year,10)}, (err,muerte) =>{
            if(err) return res.sendStatus(500);
            if(muerte.length == 0) return res.sendStatus(404, "NOT FOUND")
            muerte = muerte.map((c) => { delete c._id; return c });
            res.status(200, "OK").send(JSON.stringify(muerte[0])); 
        });
    });


    //REMOVE 1 ELEMENTO 
    app.delete(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
        db.find({"codecountry": req.params.codecountry, "year": parseInt(req.params.year,10)}, (err,muerte) =>
        {if(muerte.length == 0){ 
            res.sendStatus(404, "NOT FOUND")
        } else {
            db.remove({"codecountry": req.params.codecountry, "year": parseInt(req.params.year,10)}, {}, (err,numRemoved) => {
                if(err){
                    res.sendStatus(500, "ERROR")
                } else{
                    res.sendStatus(200, "OK")
                }
            })
        }})
    });

    //REMOVE TODOS
    app.delete(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => { 
            if(err) return res.sendStatus(500);
            res.sendStatus(200, "OK");
        });
    });

}
