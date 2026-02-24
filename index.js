let express = require('express');
let cool = require('cool-ascii-faces');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

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
//DANIEL
const {ejemploDatos, calcularMediaMenores14} = require('./index-DDLRF');

app.get(BASE_URL_SAMPLES + '/DDLRF',(req, res) => {
    res.send(`<html><body><h1> Resultado de la Media de Menores de 14 Muertos por SIDA: 
    <h1>${calcularMediaMenores14(ejemploDatos, "AFG")}</h1>
    </h1></body></html>`)
});

app.use(express.json());
let arrayMuertes = [];

app.get(BASE_URL_API+'/aids-deaths-stats', (req, res) => {
    res.status(200).json(arrayMuertes); 
}); 

app.get(BASE_URL_API+'/aids-deaths-stats/loadInitialData', (req,res) => {
    if (arrayMuertes.length > 0) {
        return res.status(409).json({ error: 'Datos ya cargados' });
    }

    let counter = 0;
    const csvData = [];
    fs.createReadStream('./data/Age_share_death.csv')
        .pipe(csv({ headers: true })) 
        .on('data', (row) => {
            if (counter < 15) {
                csvData.push(row);  
                counter++;
            }
        })
        .on('end', () => { 
            arrayMuertes = csvData;
            res.status(201).json({ 
                message: 'Datos CSV cargados', 
                count: arrayMuertes.length 
            });
        });
});








    






//--------------------------------------------------------------------------------------------
//MARIA

const {cholera_stats, media_muertes_colera_pais_despues_del_año} = requiere('./index-MTC.js');

app.get('/samples/MTC' ,(req, res) => {
    res.send(media_muertes_colera_pais_despues_del_año(cholera_stats, "afganistan", 2009));
});





//--------------------------------------------------------------------------------------------


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});