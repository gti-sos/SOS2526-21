let express = require('express');
let cool = require('cool-ascii-faces');
let bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(bodyParser.json())

let PORT = process.env.PORT || 3000;
let BASE_URL_SAMPLES = "/samples";
let BASE_URL_API = "/api/v1";

app.use('/about', express.static('./static/about.html'))

app.get('/cool',(req, res) => {
    res.send(`<html><body><h1>
    ${cool()}
    </h1></body></html>`)
});

//AQUI SE PUEDE PONER LAS TAREAS PERSONALES 
//--------------------------------------------------------------------------------------------

//-------
//DANIEL
//-------

const {ejemploDatos, calcularMediaMenores14} = require('./index-DDLRF');

app.get(BASE_URL_SAMPLES + '/DDLRF',(req, res) => {
    res.send(`<html><body><h1> Resultado de la Media de Menores de 14 Muertos por SIDA: 
    <h1>${calcularMediaMenores14(ejemploDatos, "AFG")}</h1>
    </h1></body></html>`)
});


let arrayMuertes = [];

//GET DATOS
app.get(BASE_URL_API+'/aids-deaths-stats', (req, res) => {
    let datos = arrayMuertes
    if (req.query.codecountry) {
        datos = datos.filter(d => d.codecountry === req.query.codecountry);
    }
    
    if (req.query.year) {
        datos = datos.filter(d => d.year === req.query.year);
    }
    
    if (req.query.from || req.query.to) {
        const from = parseInt(req.query.from) || 0;
        const to = parseInt(req.query.to) || 9999;
        datos = datos.filter(d => d.year >= from && d.year <= to);
    }
    res.status(200, "OK").send(JSON.stringify(datos, null, 2)); 
}); 

//GET LOAD_INITIAL_DATA
app.get(BASE_URL_API+'/aids-deaths-stats/loadInitialData', (req,res) => {
    if (arrayMuertes.length > 0) {
        return res.sendStatus(409, "CONFLICT");
    }

    let counter = 0;
    const csvData = [];
    fs.createReadStream('./data/Age_share_death.csv')
        .pipe(csv()) 
        .on('data', (row) => {
            if (counter < 20) {
                csvData.push(row);  
                counter++;
            }
        })
        .on('end', () => { 
            arrayMuertes = csvData;
            res.sendStatus(201, "CREATED");
        });
});

//POST 1 ELEMENTO NUEVO A DATOS
app.post(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
    if(!req.body.country||!req.body.codecountry||!req.body.year||
        !req.body.death_count_hiv_aids_under_5||!req.body.death_count_hiv_aids_70_plus||
        !req.body.death_count_hiv_aids_5_14||!req.body.death_count_hiv_aids_15_49||
        !req.body.death_count_hiv_aids_50_69){
            return res.sendStatus(400,"BAD REQUEST");
        }
    arrayMuertes.push(req.body);
    res.sendStatus(201, "CREATED");
});

//POST NO PERMITIDO
app.post(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
    res.sendStatus(405, "METHOD NOT ALLOWED")
});

//PUT 1 ELEMENTO
app.put(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
    const index = arrayMuertes.findIndex(d => d.codecountry === req.params.codecountry && d.year === req.params.year);
    if(index === -1) return res.sendStatus(404, "NOT FOUND");
    if(!req.body.country||!req.body.codecountry||!req.body.year||
        !req.body.death_count_hiv_aids_under_5||!req.body.death_count_hiv_aids_70_plus||
        !req.body.death_count_hiv_aids_5_14||!req.body.death_count_hiv_aids_15_49||
        !req.body.death_count_hiv_aids_50_69){
            return res.sendStatus(400,"BAD REQUEST");
        }
    if(arrayMuertes[index].country !== req.body.country || arrayMuertes[index].codecountry !== req.body.codecountry){
        return res.sendStatus(401,"UNAUTHORIZED")
    }
    arrayMuertes[index] = req.body;
    res.sendStatus(200, "OK")
    
});

//PUT NO PERMITIDO
app.put(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
    res.sendStatus(405, "METHOD NOT ALLOWED")
});



//GET 1 ELEMENTO
app.get(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
    const dato = arrayMuertes.find(d => 
        d.codecountry === req.params.codecountry && d.year === req.params.year
    );
    if (!dato) return res.status(404, "NOT FOUND").send(JSON.stringify([], null, 2));
    res.status(200, "OK").send(JSON.stringify(dato, null, 2));
});

//REMOVE 1 ELEMENTO 
app.delete(BASE_URL_API + '/aids-deaths-stats/:codecountry/:year', (req, res) => {
    const index = arrayMuertes.findIndex(d => 
        d.codecountry === req.params.codecountry && d.year === req.params.year
    );

    if (index === -1) return res.sendStatus(404, "NOT FOUND");
    arrayMuertes.splice(index, 1);
    res.sendStatus(200, "OK");
});

//REMOVE TODOS
app.delete(BASE_URL_API + '/aids-deaths-stats', (req, res) => {
    arrayMuertes = [];
    res.sendStatus(200, "OK");
});


//--------------------------------------------------------------------------------------------
//-------
//MARIA
//-------

const {cholera_stats, media_muertes_colera_pais_despues_del_año} = require('./index-MTC.js');

app.get('/samples/MTC' ,(req, res) => {
    res.send(media_muertes_colera_pais_despues_del_año(cholera_stats, "afganistan", 2009));
});


let cholera_stats_array=[];

app.get(BASE_URL_API + "/cholera_stats/loadInitialData", (req, res) => {

        if (cholera_stats_array.length>0){
            //si el servidor ya tiene el array de colera en memoria, lanza codigo de error 409 (conflict)
            return res.status(409).send(JSON.stringify("Data alredy load", null, 2));
        }

        //.on() para eventos (asincrono) 

        const csvData= [];
        fs.createReadStream("./data/cholera_stats.csv")
        .pipe(csv()) //lee primera linea de cabezera (asociación clave:valor)
        .on("data",(row)=> {csvData.push({  // "data" -> evento por cada una nueva fila
            country: row["Country"],
            year: parseInt(row["Year"]),
            reportedCases: parseInt(row["Number of reported cases of cholera"]),
            reportedDeaths: parseInt(row["Number of reported deaths from cholera"]),
            fatalityRate: parseFloat(row["Cholera case fatality rate"]),
            whoRegion: row["WHO Region"]
            }) ;
        })
        .on("end", () => { // "end" -> salta cuando ya no quedan mas filas
            cholera_stats_array=csvData; 
            res.status(201).send(JSON.stringify("Data loaded succesfully", null, 2));
        })
        .on("error", (error)=> { // "error" -> salta cuando hay error en parsear csv
            res.status(500).send(JSON.stringify("Error reading csv", null, 2));
        })

    });


//GET de varios elementos / filtrando


app.get(BASE_URL_API + "/cholera_stats", (req, res) => {
        /*if (cholera_stats_array.length===0){ //error si no se han cargado los datos
            return res.status(404).send(JSON.stringify("No data loaded", null, 2));
        }*/

        let datos = cholera_stats_array;

        //filtrar por pais
        if(req.query.country){
            datos= datos.filter(d=>d.country===req.query.country);
        }

        //filtrar por año
        if(req.query.year) {
            datos= datos.filter(d=>d.year===parseInt(req.query.year));
        }

        //filtrar por region
        if (req.query.region) {
        datos = datos.filter(d => d.whoRegion === req.query.region);
    }

        //filtrar por rango de fechas
        if(req.query.from || req.query.to) {
            datos= datos.filter(d=>d.year >= (parseInt(req.query.from) || 0)
                                && d.year <= (parseInt(req.query.to) || 9999));
        }

        res.status(200).send(JSON.stringify(datos, null, 2));
    })


    //GET sobre 1 elemento concreto

    app.get(BASE_URL_API + "/cholera_stats/:country/:year", (req, res) =>{

        const dato = cholera_stats_array.find(d=> d.country === req.params.country 
                                                && d.year ===parseInt(req.params.year));
        if (!dato){
            return res.status(404).send(JSON.stringify("not found", null, 2));
        }

        res.status(200).send(JSON.stringify(dato, null, 2));
    });


    //POST

    app.post(BASE_URL_API + "/cholera_stats", (req, res) =>{
        
        if(!req.body.country || !req.body.year || !req.body.reportedCases || !req.body.reportedDeaths
            || !req.body.fatalityRate || !req.body.whoRegion
        ){
            return res.status(400).send(JSON.stringify("Missing fields", null, 2));
        }

        if(cholera_stats_array.find(d=> d.country === req.body.country &&  d.year === parseInt(req.body.year))){
            return res.status(409).send(JSON.stringify("Already exist", null, 2));
        }
         //body por que viene el identificador de el cuerpo de la peticion
        const nuevo = {
            country: req.body.country,
            year: parseInt(req.body.year),
            reportedCases: parseInt(req.body.reportedCases),
            reportedDeaths: parseInt(req.body.reportedDeaths),
            fatalityRate: parseFloat(req.body.fatalityRate),
            whoRegion: req.body.whoRegion
        };
        cholera_stats_array.push(nuevo);
        res.sendStatus(201);

    });

    //PUT

    app.put(BASE_URL_API + "/cholera_stats/:country/:year", (req, res) =>{
          if(!req.body.country || !req.body.year || !req.body.reportedCases || !req.body.reportedDeaths
            || !req.body.fatalityRate || !req.body.whoRegion
        ){
            return res.status(400).send(JSON.stringify("Missing fields", null, 2));
        }

        const index= cholera_stats_array.findIndex(d=> d.country === req.params.country && d.year === parseInt(req.params.year));
        //params por que viene el identificador de la url
        if (index==-1){// devuelve -1 si no encuentra el INDICE
        return res.status(404).send(JSON.stringify("Not found", null, 2));
        };

        const actualizado = {
            country: req.body.country,
            year: parseInt(req.body.year),
            reportedCases: parseInt(req.body.reportedCases),
            reportedDeaths: parseInt(req.body.reportedDeaths),
            fatalityRate: parseFloat(req.body.fatalityRate),
            whoRegion: req.body.whoRegion
        };

        cholera_stats_array[index]= actualizado;
        res.sendStatus(200);


    });

    
    //DELETE de 1 elemento

    app.delete(BASE_URL_API + "/cholera_stats/:country/:year", (req, res) => {
    
        const index= cholera_stats_array.findIndex(d=> d.country === req.params.country && d.year === parseInt(req.params.year));
        if (index===-1){
            return res.status(404).send(JSON.stringify("Not found", null, 2));
        }

        cholera_stats_array.splice(index, 1); //borra a partir de la posicion INDEX, 1 elemento
        res.status(200).send(JSON.stringify("Deleted successfully", null, 2));
    });
    
    //DELETE de todos los elemento
    
    
    app.delete(BASE_URL_API + "/cholera_stats", (req, res) => {
        
        cholera_stats_array=[];
        res.status(200).send(JSON.stringify("Deleted successfully", null, 2));
        
    });



//--------------------------------------------------------------------------------------------------
//IVÁN
//--------------------------------------------------------------------------------------------------

let array_creencias=[]

const average_percent_religion_country=require("./index-IAD.js");

//SAMPLE
app.get(BASE_URL_SAMPLES+"/IAD",(req,res)=>{
    let datos=average_percent_religion_country("jews","africa");

    res.json({
        mensaje:"Porcentaje medio de judíos en africa (país)",
        resultado:datos
    });
});

//GET
app.get(BASE_URL_API+"religious-believes-stats",(req,res)=>{
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

app.get(BASE_URL_API+"religious-blieves-stats/load-initial-data",(req,res)=>{
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
    array_creencias.push(req.body);
    res.sendStatus(201);
});

//FORBIDDEN POST (¿Utilidad de definir esto?)

app.post(BASE_URL_API+"religious-believes-stats/:entity/:year",(req,res)=>{
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
    if(req.params.entity!==array_creencias[index].entity || 
        req.params.year!==array_creencias[index].year){
        return res.sendStatus(401);
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
    
})

//ANNIHILATE DATA

app.delete(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    array_creencias=[];
    return res.send(200);
})

// FIN TAREAS PERSONAL
//--------------------------------------------------------------------------------------------


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});