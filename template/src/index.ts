import http from 'http';
import express from 'express';

const router = express()
const {PORT = 3333} = process.env;
const server = http.createServer(router);

server.listen(PORT, () => console.log('Server Listening on PORT:' + PORT));
