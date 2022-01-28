const express = require('express'); // Node.js specific syntax for importing express framework
const bodyParser = require('body-parser'); // Library to parse the body of incoming requests


const usersRoutes = require('./routes/users-routes');

const app = express(); // create our app object

app.use(bodyParser.json());

app.use('/api/users', usersRoutes); // Only allow access to users-routes.js if their path starts with /api/users

app.listen(5000); // Tell the app to listen on a specific port