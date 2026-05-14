import fs from 'fs';
import csv from 'csv-parser';
import dataStore from 'nedb';
let db = new dataStore({ filename: './data/db/cholera-stats.db', autoload: true });
let BASE_URL_API = "/api/v1";
let DOCS_URL= "https://documenter.getpostman.com/view/52370283/2sBXiesZo6";






export function loadBackendApiMTC(app){

    
//cargar fotos de la nasa 
//api_key=WHxd7uYYfILcmHqbQiyzsIUwogFLSriiuHXVSAcy


app.get(BASE_URL_API+'/nasa-fotos', async (req, res) => {
  const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=WHxd7uYYfILcmHqbQiyzsIUwogFLSriiuHXVSAcy&count=10');
  const data = await response.json();
  res.status(200).send(JSON.stringify(data, null, 2));
});




    let cholera_stats_array=[];
    
        
    //Redirect POSTMAN Doc

    app.get(BASE_URL_API+"/cholera-stats/docs",(req,res)=>{
        res.redirect(DOCS_URL);
        
    });


    app.get(BASE_URL_API + "/cholera-stats/loadInitialData", (req, res) => {
            
            db.find({}, (err, chol_st)=>{
                
                if(err){
                    return res.sendStatus(500)
                }
                if(chol_st.length>0){
                    return res.sendStatus(409, "conflict");
                }

                //.on() para eventos (asincrono) 

                const csvData= [];
                fs.createReadStream("./data/cholera_stats.csv")
                .pipe(csv()) //lee primera linea de cabezera (asociación clave:valor)
                .on("data",(row)=> {
                    csvData.push({  // "data" -> evento por cada una nueva fila
                    country: row["Country"],
                    year: parseInt(row["Year"]),
                    reportedCases: parseInt(row["Number of reported cases of cholera"]),
                    reportedDeaths: parseInt(row["Number of reported deaths from cholera"]),
                    fatalityRate: parseFloat(row["Cholera case fatality rate"]),
                    whoRegion: row["WHO Region"]
                    });
                }
                )
                .on("end", () => { // "end" -> salta cuando ya no quedan mas filas
                    db.insert(csvData, (err, new_data)=>{
                        if(err){
                            return res.sendStatus(500, "Error reading csv");
                        }
                        res.sendStatus(201, "Data loaded successfully");
                    }); 
                    
                })
                .on("error", (error)=> { // "error" -> salta cuando hay error en parsear csv
                    return res.sendStatus(500)
                })
            
           
            });

        });


    //GET de varios elementos / filtrando


    app.get(BASE_URL_API + "/cholera-stats", (req, res) => {
            //if (cholera_stats_array.length===0){ //error si no se han cargado los datos
              //  return res.status(404).send(JSON.stringify("No data loaded", null, 2));
            //}

            let consulta ={}; //objeto vacio, parametro del find, que busca por esos filtros


            //filtrar por casos
            if(req.query.reportedCases){
                consulta.reportedCases = parseInt(req.query.reportedCases);
            }

            
            //filtrar por muertes
            if(req.query.reportedDeaths){
                consulta.reportedDeaths = parseInt(req.query.reportedDeaths);
            }

            //filtrar por pais
            if(req.query.country){
                consulta.country = req.query.country;
            }

            //filtrar por año
            if(req.query.year) {
               consulta.year = parseInt(req.query.year);
            }

            if(req.query.region){
                consulta.whoRegion = req.query.region;
            }

            
            //filtrar por rate
            if(req.query.fatalityRate){
                consulta.fatalityRate = parseFloat(req.query.fatalityRate);
            }

            //rango de fechas
            if(req.query.from || req.query.to){
                    consulta.year = {
                        $gte: parseInt(req.query.from) || 0,
                        $lte: parseInt(req.query.to)   || 9999
                    };
                }


            db.find(consulta, (err, chol_st)=>{

                if(err){
                    return res.sendStatus(500);
                }
                chol_st.map(c=> delete c._id);

                    //paginacion
                    const limit = parseInt(req.query.limit) || chol_st.length;
                    const offset = parseInt(req.query.offset) || 0;
                    chol_st = chol_st.slice(offset, offset + limit);

                res.status(200).send(JSON.stringify(chol_st, null, 2));
            
            });
        });


        //GET sobre 1 elemento concreto

        app.get(BASE_URL_API + "/cholera-stats/:country/:year", (req, res) =>{

            let consulta={};

            consulta.country = req.params.country;
            consulta.year =parseInt(req.params.year);
            

            db.findOne(consulta, (err, chol_st)=>{
                if(err){
                    return res.sendStatus(500);
                }
                if (!chol_st) { 
                    return res.status(404).send(JSON.stringify("not found"));
                }

                delete chol_st._id;
                res.status(200).send(JSON.stringify(chol_st, null, 2));
            })        


            
        });


        //POST 

        app.post(BASE_URL_API + "/cholera-stats", (req, res) =>{
            if(!req.body.country || !req.body.year || !req.body.reportedCases || !req.body.reportedDeaths
                || !req.body.fatalityRate || !req.body.whoRegion
            ){
                return res.status(400).send(JSON.stringify("Missing fields", null, 2));
            }
            //body por que viene el identificador de el cuerpo de la peticion
            const newCholera = {
                country: req.body.country,
                year: parseInt(req.body.year),
                reportedCases: parseInt(req.body.reportedCases),
                reportedDeaths: parseInt(req.body.reportedDeaths),
                fatalityRate: parseFloat(req.body.fatalityRate),
                whoRegion: req.body.whoRegion
            };

            db.findOne({country: newCholera.country, year: parseInt(newCholera.year)}, (err, chol_st)=>{
                if (err) return res.sendStatus(500);
                if(chol_st) return res.sendStatus(409, "Already exists");
                db.insert(newCholera, (err, chol_st) => {
                    if (err) return res.sendStatus(500);
                    res.sendStatus(201, "created");
                });
                
                });
            });
            


        
        //post mal hecho 
        
        app.post(BASE_URL_API+"/cholera-stats/:country/:year",(req,res)=>{
            return res.sendStatus(405);
        });


        //PUT

        app.put(BASE_URL_API + "/cholera-stats/:country/:year", (req, res) =>{
            //por que al cargar los datos parseados de backend si hay un 0 lo detecta como campo vacio.
            if(!req.body.country || req.body.year == null ||
                req.body.reportedCases == null || req.body.reportedDeaths == null ||
                req.body.fatalityRate == null || !req.body.whoRegion)
            {
                return res.status(400).send(JSON.stringify("Missing fields", null, 2));
            }


                    
            if (req.body.country !== req.params.country || parseInt(req.body.year) !== parseInt(req.params.year)) {
                return res.sendStatus(400,"BAD REQUEST (UNAUTHORIZED)");
            }


            //body por que viene el identificador de el cuerpo de la peticion
            const editedCholera = {
                country: req.body.country,
                year: parseInt(req.body.year),
                reportedCases: parseInt(req.body.reportedCases),
                reportedDeaths: parseInt(req.body.reportedDeaths),
                fatalityRate: parseFloat(req.body.fatalityRate),
                whoRegion: req.body.whoRegion
            };
           
           

            db.findOne({country: editedCholera.country, year: parseInt(editedCholera.year)}, (err, chol_st)=>{
                if (err) return res.sendStatus(500);
                if(!chol_st){
                    return res.sendStatus(404, "Not found");
                }
                db.update(
                    {country: req.params.country, year: parseInt(req.params.year)}, 
                    {$set: editedCholera}, 
                    {},
                    (err, chol_st) => {
                        if (err) return res.sendStatus(500);
                        res.sendStatus(200);
                    })


            });



        });


        //put mal hecho
            
        app.put(BASE_URL_API+"/cholera-stats",(req,res)=>{
            return res.sendStatus(405);
        });

            
        //DELETE de 1 elemento

        app.delete(BASE_URL_API + "/cholera-stats/:country/:year", (req, res) => {
        
            db.findOne({country: req.params.country, year: parseInt(req.params.year)},(err, chol_st) =>{
                if (err) return res.sendStatus(500);
                if(!chol_st){
                    return res.status(404).send(JSON.stringify("Not found", null, 2));

                }
                db.remove({country: req.params.country, year: parseInt(req.params.year)},{},(err,chol_st) => {
                    if (err) return res.sendStatus(500);
                    res.sendStatus(200, "OK");
                })
            });
        });


        
        
        //DELETE de todos los elemento
        
        
        app.delete(BASE_URL_API + "/cholera-stats", (req, res) => {
            
            db.remove({}, { multi: true }, (err, chol_st)=>{
                if (err) return res.sendStatus(500);
                res.status(200).send(JSON.stringify("Deleted successfully", null, 2));
            });
            
        });


    }


