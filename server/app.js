let rServer = require('r-server'),
    app = rServer.instance();

//send hello world message
app.get('/', (req, res) => {
    res.end('Hello World');
});

module.exports = app;