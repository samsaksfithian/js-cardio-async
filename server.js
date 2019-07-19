const http = require('http');
const handleRoutes = require('./router');

const server = http.createServer();
const PORT = 5555;

server.on('request', handleRoutes);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
