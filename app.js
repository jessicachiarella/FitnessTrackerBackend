require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors');
const router = require('./api');
const morgan = require('morgan');
const client = require('./db/client');
client.connect();

// Setup your Middleware and API Router here
//CORS
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use("/api", router);


app.use((error, req, res, next) =>{
    res.send({
        message: error.message,
        name: error.name,
        error: error.message
    })
})

module.exports = app;
