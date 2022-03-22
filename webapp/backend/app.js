const express = require('express'); // Node.js specific syntax for importing express framework
const bodyParser = require('body-parser'); // Library to parse the body of incoming requests
const mongoose = require('mongoose'); // MongoDB helper library
const cors = require('cors'); // Allows us to make requests to an API on our computer, from our computer

const usersRoutes = require('./routes/users-routes');
const checkAuth = require('./middleware/check-auth');
const dataRoutes = require('./routes/data-routes');
const iotCoreRoutes = require('./routes/iot-core-routes');

var corsOptions = {
    origin: '*', // * means any origin
    optionsSuccessStatus: 200,
  }

const app = express(); // create our app object

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use('/api/users', usersRoutes); // Only allow access to users-routes.js if their path starts with /api/users



app.use(checkAuth);

app.use('/api/data', dataRoutes);
app.use('/api/iotCore',iotCoreRoutes);


mongoose
    .connect('uri ask kevin')
    .then(() => {app.listen(5000);console.log("Connected to MongoDB server...");}) 
    .catch(err =>{console.log("Error connecting to MongoDB...");
    console.log(err)});
