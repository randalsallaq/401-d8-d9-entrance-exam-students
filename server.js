'use strict'
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
// const { delete } = require('superagent');
const { query } = require('express');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();


// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


// ----------------------
// ------- Routes -------
// ----------------------
app.get('/house_name',getCharactars);
app.post('/my-characters', saveFav);
app.get('/my-characters', getFav);
app.get('/character/:id', getDetails);
app.put('/character/:id', updateData);
app.delete('/character/:id', deleteData);

// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------

function getCharactars(req,res){

    let dataArray = [];
    let url = 'http://hp-api.herokuapp.com/api/characters';
    superagent.get(url).then(data=>{
        data.body.forEach(element=>{
            dataArray.push(new Charactar(element));
        });
        res.render('charactars', {result: dataArray} );
    }).catch(error=>{
        console.log('something went wrong', error);
    });

}


function saveFav(req,res){
let statement = 'INSERT INTO charactar (name, patronus, alive, image) VALUES ($1,$2,$3,$4) RETURNING *;';
let values = [req.body.name, req.body.patronus, req.body.alive, req.body.image];

client.query(statement,values).then(()=>{
    res.redirect('/my-characters');
}).catch(error=>{
    console.log('something went wrong', error);
});
}
//\\
function getFav(req,res){
    let statement = 'SELECT * FROM charactar;';
    client.query(statement).then(data=>{

        res.render('fav', {result: data.rows});
    }).catch(error=>{
        console.log('something went wrong', error);
    });
}

function getDetails(req,res){
    let statement = 'SELECT * FROM charactar WHERE id=$1';
    let values = [req.params.id];
    client.query(statement,values).then(data=>{
        res.render('details', {result: data.rows[0]});
    }).catch(error=>{
        console.log('something went wrong', error);
    });
}


function updateData(req,res){
    let statement = 'UPDATE charactar SET name=$1, patronus=$2, alive=$3, image=$4 WHERE id=$5;';
    let values =[req.body.name, req.body.patronus, req.body.alive, req.body.image, req.params.id];
    client.query(statement,values).then(()=>{
        res.redirect('details');
    })
}

function deleteData(req,res){
    let statement = 'DELETE FROM charactar WHERE id=$1;';
    let values = [req.params.id];
    client.query(statement,values).then(()=>{
        res.redirect('details');
    })
}
//\\
function Charactar(data){
    this.name = data.name;
    this.patronus = data.patronus;
    this.alive = data.alive;
    this.image = data.image;
}



// -----------------------------------
// --- CRUD Pages Routes functions ---
// -----------------------------------



// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
