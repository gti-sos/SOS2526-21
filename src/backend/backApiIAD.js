
import fs from 'fs';
import csv from 'csv-parser';
import dataStore from 'nedb';
let db = new dataStore({filename: './data/db/religious-believes-stats.db', autoload: true});
let BASE_URL_API = "/api/v1";

//comentario serio
function loadBackendApiIAD(app){

let array_creencias=[]
db.insert(array_creencias); //Innecesario?

//Redirect to POSTMAN Documentation

app.get(BASE_URL_API+"/religious-believes-stats/docs",(req,res)=>{
    res.redirect("https://documenter.getpostman.com/view/52385252/2sBXierDsV");
    
});


//GET
app.get(BASE_URL_API+"/religious-believes-stats",(req,res)=>{

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let filtro=req.query;
    delete filtro.limit;
    delete filtro.offset;

    db.find(filtro,(err,creencias)=>{
        if(err) return res.sendStatus(500);
        //if(creencias.length===0) return res.sendStatus(404);
        let datos=creencias.map(element=> {
            delete element._id;
            return element;});
        
            
        datos = datos.slice(offset, offset + limit);

        res.status(200).send(JSON.stringify(datos, null, 2));

        })
     
});

//INITIAL DATA

app.get(BASE_URL_API+"/religious-believes-stats/loadInitialData",(req,res)=>{
   
    db.find({},(err,data)=>{
        if(err) return res.sendStatus(500);
        if(data.length>0) return res.sendStatus(409);

        let number_of_rows = 0;
        const csv_datos = [];
        fs.createReadStream('./data/share-of-population-by-religious-affiliation.csv')
            .pipe(csv()) 
            .on('data', (row) => {
                if (number_of_rows < 30) {
                    csv_datos.push(row);  
                    number_of_rows++;
                }
            })
            .on('end', () => { 
                db.insert(csv_datos);
                res.sendStatus(201, "CREATED");
            });
    })

    

}
);

//POST

app.post(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    if(!(req.body.entity && req.body.code && req.body.year && req.body.christian &&
        req.body.jew && req.body.muslim && req.body.hindu && req.body.budhist && req.body.other
        && req.body.no_religion)){
            return res.sendStatus(400);
        }
    
    db.find({entity:req.body.entity,year:req.body.year},(err,dato)=>{
        if(err) res.sendStatus(500);

        if(dato.length>0) return res.sendStatus(409);
        db.insert(req.body);
        res.sendStatus(201);
    })
    
    
});

//FORBIDDEN POST (¿Utilidad de definir esto?)

app.post(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    return res.sendStatus(405);
});

//PUT 
app.put(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    
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


    db.update({entity:req.params.entity,year:req.params.year}, {$set:req.body},(err,data)=>{
        if(err) return res.sendStatus(500);
        if(data===0) return res.sendStatus(404);
        res.sendStatus(200);
    })
    
    
    
});


//FORBIDDEN PUT

app.put(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    return res.sendStatus(405);
});

//GET one specific element

app.get(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    
    db.find({entity:req.params.entity,year:req.params.year},(err,dato)=>{
        if(err) res.sendStatus(500);
        if (dato.length===0) return res.status(404, "NOT FOUND").send(JSON.stringify([], null, 2));
        dato=dato.map(e=>{
            delete e._id;
            return e;
        })
        res.status(200, "OK").send(JSON.stringify(dato[0], null, 2));
    })
    
});

//DELETE

app.delete(BASE_URL_API+"/religious-believes-stats/:entity/:year",(req,res)=>{
    
    db.remove({entity:req.params.entity,year:req.params.year},(err,num)=>{
        if(err) res.sendStatus(500);
        if(num===0) return res.sendStatus(404);
        res.sendStatus(200);
    })

    
    
})

//ANNIHILATE DATA

app.delete(BASE_URL_API+"/religious-believes-stats",(req,res)=>{
    db.remove({},{multi:true},(err,num)=>{
        if(err) res.sendStatus(500);
        console.log(`${num} elements removed`);
        res.sendStatus(200);
    })
    
})

}

export {loadBackendApiIAD};