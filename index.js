let express = require('express');
let cool = require('cool-ascii-faces');

const app = express();

let PORT = process.env.PORT || 3000;

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

app.get('/samples/DDLRF',(req, res) => {
    res.send(`<html><body><h1> Resultado de la Media de Menores de 14 Muertos por SIDA: 
    <h1>${calcularMediaMenores14(ejemploDatos, "AFG")}</h1>
    </h1></body></html>`)
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