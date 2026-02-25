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









// FIN TAREAS PERSONAL
//--------------------------------------------------------------------------------------------


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});