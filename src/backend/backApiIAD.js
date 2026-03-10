
import fs from 'fs';
import csv from 'csv-parser';
import dataStore from 'nedb';
let db = new dataStore();
let BASE_URL_API = "/api/v1";


function loadBackendApiIAD(app){

let array_creencias=[]
db.insert(array_creencias);

//Redirect to POSTMAN Documentation

app.get(BASE_URL_API+"/religious-believes-stats/docs",(req,res)=>{
    res.redirect("https://documenter.getpostman.com/view/52385252/2sBXierDsV");
    
});


//GET
app.get(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    let datos=array_creencias;
    if(req.query.entity){
        datos=datos.filter((row)=>row.entity===req.query.entity);
    }

    if(req.query.year){
        datos=datos.filter((row)=>row.year===req.query.year);
    }

    if(req.query.code){
        datos=datos.filter((row)=>row.code===req.query.code);
    }

    res.status(200).send(JSON.stringify(datos, null, 2)); 
});

//INITIAL DATA

app.get(BASE_URL_API+"/religious-believes-stats/loadInitialData",(req,res)=>{
    if(array_creencias.length>0){
        return res.sendStatus(409);
    }

    let number_of_rows = 0;
    const csv_datos = [];
    fs.createReadStream('./data/share-of-population-by-religious-affiliation.csv')
        .pipe(csv()) 
        .on('data', (row) => {
            if (number_of_rows < 10) {
                csv_datos.push(row);  
                number_of_rows++;
            }
        })
        .on('end', () => { 
            array_creencias = csv_datos;
            res.sendStatus(201, "CREATED");
        });

}
);

//POST

app.post(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    if(!(req.body.entity && req.body.code && req.body.year && req.body.christian &&
        req.body.jew && req.body.muslim && req.body.hindu && req.body.budhist && req.body.other
        && req.body.no_religion)){
            return res.sendStatus(400);
        }

    if (array_creencias.filter((element)=>element.entity===req.body.entity
     && element.year===req.body.year).length>0){
        res.sendStatus(409);
     }

    array_creencias.push(req.body);
    res.sendStatus(201);
});

//FORBIDDEN POST (¿Utilidad de definir esto?)

app.post(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    return res.sendStatus(405);
});

//PUT 
app.put(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    let index=array_creencias.findIndex(element=>element.entity===req.params.entity
         && element.year===req.params.year);
    
    //Search if the element exists
    if(index===-1){
        return res.sendStatus(404);
    }

    //Check if the body is correct
    if(!(req.body.entity && req.body.code && req.body.year && req.body.christian &&
        req.body.jew && req.body.muslim && req.body.hindu && req.body.budhist && req.body.other
        && req.body.no_religion)){
            return res.sendStatus(400);
        }
    
    //Integrity check
    if(req.params.entity!==req.body.entity || 
        req.params.year!==req.body.year){
        return res.sendStatus(400);
    }


    //Update data
    array_creencias[index]=req.body;
    return res.sendStatus(200);
});


//FORBIDDEN PUT

app.put(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    return res.sendStatus(405);
});

//GET one specific element

app.get(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    let dato=array_creencias.find(element=>element.entity===req.params.entity 
        && element.year===req.params.year);
    
    if (!dato) return res.status(404, "NOT FOUND").send(JSON.stringify([], null, 2));
    res.status(200, "OK").send(JSON.stringify(dato, null, 2));

});

//DELETE

app.delete(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    let index=array_creencias.findIndex(element=>element.entity===req.params.entity &&
         element.year===req.params.year);
    if(index===-1){
        return res.sendStatus(404);
    }
    array_creencias.splice(index,1);
    res.sendStatus(200);
    
})

//ANNIHILATE DATA

app.delete(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    array_creencias=[];
    return res.send(200);
})

}

module.exports(loadBackendApiIAD);