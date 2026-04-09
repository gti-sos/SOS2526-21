import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {handler} from './src/frontend/build/handler.js'
import {loadBackendApiDDLRF} from './src/backend/backApiDDLRF.js'
import {loadBackendApiDDLRFv2} from './src/backend/backApiDDLRFv2.js'
import { loadAuth } from './src/backend/auth.js' 

import { loadOAuthDDLRF } from './src/backend/oauthDDLRF.js';

import {loadBackendApiMTC} from './src/backend/backApiMTC.js'

import { loadBackendApiIAD } from './src/backend/backApiIAD.js'

import path from 'path'      
import { fileURLToPath } from 'url' 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(bodyParser.json())

let PORT = process.env.PORT || 3000;

//AQUI SE PUEDE PONER LAS TAREAS PERSONALES 
//--------------------------------------------------------------------------------------------

//-------
//DANIEL
//-------

loadAuth(app) 
loadOAuthDDLRF(app);

loadBackendApiDDLRF(app)

loadBackendApiDDLRFv2(app)
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

app.use('/react', express.static(path.join(__dirname, 'src/frontend-react/dist')))

app.get('/react/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/frontend-react/dist/index.html'))
})

app.use(handler)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});