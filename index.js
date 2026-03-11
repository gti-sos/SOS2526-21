import express from 'express'
import bodyParser from 'body-parser'


import {loadBackendApiDDLRF} from './src/backend/backApiDDLRF.js'

import {loadBackendApiMTC} from './src/backend/backApiMTC.js'

import { loadBackendApiIAD } from './src/backend/backApiIAD.js'

const app = express();
app.use(bodyParser.json())

let PORT = process.env.PORT || 3000;

app.use('/about', express.static('./static/about.html'))
app.use('/', express.static('./static'))




//AQUI SE PUEDE PONER LAS TAREAS PERSONALES 
//--------------------------------------------------------------------------------------------

//-------
//DANIEL
//-------


loadBackendApiDDLRF(app)

//--------------------------------------------------------------------------------------------
//-------
//MARIA
//-------

loadBackendApiMTC(app)

//--------------------------------------------------------------------------------------------------
//IVÁN
//--------------------------------------------------------------------------------------------------

loadBackendApiIAD(app);

// FIN TAREAS PERSONAL
//--------------------------------------------------------------------------------------------


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});