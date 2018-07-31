let rServer = require('r-server'),
    app = rServer.instance();

//send hello world message
app.get('/', (req, res) => {
    res.end('Hello World');
});

//prolong request
app.get('prolong-response', () => {
    //do nothing
});

//report request header
app.all('report-header/{header}', (request, response, header) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end(request.headers[header]);
});

//report query
app.all('report-query', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/json'
    });
    response.end(JSON.stringify(request.query));
});

module.exports = app;