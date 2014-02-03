var express = require('express');
var router = require('./config/routes');
var http = require('http');
var path = require('path');

var app = express();

// CONFIG
app.set('port', process.env.PORT || 8000);
app.use(express.logger());
app.engine('html', require('ejs').renderFile);

// ROUTING
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/public/views');

router(app);

app.listen(app.get('port'));
console.log('Server running at port 8000');