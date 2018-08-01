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
    response.end(request.headers[header] || 'undefined');
});

//report query
app.all('report-query', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/json'
    });
    response.end(JSON.stringify(request.query));
});

//perform a server action
app.post('user/create', (request, response) => {
    response.writeHead(201, 'User created', {
        'Content-Location': '/user/1'
    });
    response.end();
});

//send incorrect content type header
app.get('send-incorrect-content-type/{entity}', (request, response, entity) => {
    let data = '';
    switch(entity) {
        case 'json':
            data = JSON.stringify({message: 'I still parsed it'});
            break;
    }
    response.writeHead(200, 'data sent', {
        'Content-Type': 'text/plain'
    });
    response.end(data);
});

//send invalid content
app.get('send-invalid-content/{entity}', (request, response, entity) => {
    let data = '',
        contentType = 'text/plain';
    switch(entity) {
        case 'json':
            contentType = 'application/json';
            data = '{"name": wrong-string, not placed in double quotes}';
            break;
    }
    response.writeHead(200, 'data sent', {
        'Content-Type': contentType
    });
    response.end(data);
});

//send content
app.get('send-content/{entity}', (request, response, entity) => {
    let data = '',
        contentType = 'text/plain';
    switch(entity) {
        case 'html':
            contentType = 'text/html';
            data = 'Hello World';
            break;
    }
    response.writeHead(200, 'data sent', {
        'Content-Type': contentType
    });
    response.end(data);
});

//send content
app.get('send-response-code/{int:code}', (request, response, responseCode) => {
    response.statusCode = responseCode;
    response.end();
});

//report request method
app.all('report/request-method', (request, response) => {
    response.writeHead(200, {
        'X-Request-Method': request.method
    });
    response.end();
});

module.exports = app;