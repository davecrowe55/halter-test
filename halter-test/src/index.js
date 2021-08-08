import express from 'express';
import axios from 'axios';
 const app = express();




// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true}))




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





// display cows
app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h2>Cow test  `);

    const cows = await getAllCows();
    
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
