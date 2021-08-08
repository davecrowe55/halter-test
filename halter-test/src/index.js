// import express from 'express';
import axios from 'axios';
// import * as express from 'express'
// const express = require('express');
// const express = __non_webpack_require__('express');
const fastify = require('fastify')({ logger: true })
const app = fastify();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// get all cows //
const getAllCows = async => {

  try {
    let headers = {
      'Content-Type': 'application/json'
    };
    let result =  axios.get('https://5d96585ca824b400141d26b2.mockapi.io/halter/device/1/status', {
      headers: headers
    });
    
    return JSON.parse(result);
    ;
  } catch (e) {
    console.error('  > Unable to retrieve cow');
    return JSON.parse(e.response.body);
  }
};


//Display all cows
const displayAllCows = (res, cow) => {
  if (cow.status === 'error') {
    res.write(`<p>Unable to retrieve contact! Error Message: ${cow.message}</p>`);
    return;
  }
  const { id, collarId, cowNumber, collarStatus, lastLocation, lat, long } = cow.properties;
  console.log(cow.properties);
  res.write(`<p>Cow Details: ${id.value} ${collarId.value} ${cowNumber.value} ${collarStatus.value} ${lastLocation.value} ${lat.value} ${long.value}</p>`);
};


//Create new cow
app.post("/", async (req, res) => {
  try {
     const newCow = req.body;
console.log(newCow);
const options = {
method: 'POST',
    url: `https://5d96585ca824b400141d26b2.mockapi.io/halter/device/1/status`,
 headers: {
accept: 'application/json',
'content-type': 'application/json',
   },
body: {
     properties: {  

id: newCow.id,
collarId: newCow.collarId,
cowNumber: newCow.cowNumber,
collarStatus: newCow.collarStatus,
lastLocation: newCow.lastLocation,
lat: newCow.lat,
long: newCow.long,

 }
  },
json: true
};

axios(options, function (error, response, body) {
if (error) throw new Error(error);

console.log(body);
});
    res.status(201).json("OK - New cow created");
  } catch (error) {
    console.log(error);
    return res.status(500).send("There is an error").end();
  }
});

//Update a cow
app.put("/", async (req, res) => {
  try {
     const updateCow = ({
      id: req.body.id,
      collarId: req.body.collarId,
      cowNumber: req.body.cowNumber,
      collarStatus: req.body.collarStatus,
      lastLocation: req.body.lastLocation,
      lat: req.body.lat,
      long: req.body.long,
     });
console.log(updateCow);
const options = {
method: 'PUT',
    url: `https://5d96585ca824b400141d26b2.mockapi.io/halter/device/1/status`,
 headers: {
accept: 'application/json',
'content-type': 'application/json',
   },
json: true
};

axios(options, function (error, response, body) {
if (error) throw new Error(error);

console.log(body);
});
    res.status(201).json("OK - Cow updated");
  } catch (error) {
    console.log(error);
    return res.status(500).send("There is an error").end();
  }
});


// display cows
app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2>Cow test  `);

    const cows = getAllCows();
    displayAllCows(res, cows);

  res.end();
});

app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

// app.listen(PORT, () => console.log(`=== Starting your app on http://localhost:${PORT} ===`));
// opn(`http://localhost:${PORT}`);


export default app;
