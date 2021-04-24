require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const server = express();

const router = require('./routes.js');

server.use(bodyParser.urlencoded({ extended: true })); 
server.use(bodyParser.json());
server.use(cookieParser());

server.use(router)

server.listen(3333, () => console.log('Server on port 3333'))