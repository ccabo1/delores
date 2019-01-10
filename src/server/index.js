const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const frontendRouter = require('./routes/frontend');
const hospitalsRouter = require('./routes/hospitals');

const DB = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

global.basedir = path.join(__dirname, '..', '..');
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/hospitals', hospitalsRouter(DB));
app.use('/', frontendRouter(DB));

// Seed data on server start
// TODO have other scripts to do this
// require('./database/seedHospitals');

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
});
