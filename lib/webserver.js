var express     = require('express');
var app         = express();

console.log(__dirname);

app.get(/\/thread\/(\d+)(?:\/(\d+))?(?:\.png)?/, require(__dirname + '/routes/thread'));
app.get(/\/post\/(\d+)(?:\.png)?/, require(__dirname + '/routes/post'));

app.get('*', require(__dirname + '/routes/default'));

app.listen(process.env.PORT);