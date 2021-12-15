const http = require('http');
const port = process.env.PORT || 8080;
const app = require('./sendmail')

const server = http.createServer(app);
server.listen(port);