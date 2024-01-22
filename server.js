require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const route = require('./routes/routes');
const layouts = require('express-ejs-layouts');
// Basic Configuration

const port = process.env.PORT || 3000;
mongoose.connect( process.env.DB_URI );
console.log('mongoose.connection.readyState---', mongoose.connection.readyState);
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('db connected'));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', 'layout');
app.use(layouts)
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
//app.use('/public', express.static(`${process.cwd()}/public`));

/* 
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
}); */
app.use('/', route);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

