require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const server = express();

const router = require('./routes.js');

server.use(cookieParser());

server.use(router)

server.listen(3333, () => console.log('Server on port 3333'))