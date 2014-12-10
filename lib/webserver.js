var express     = require('express');
var app         = express();

app.get('/thread/:threadId/:pageNo?', require(__dirname + '/routes/thread'));
app.get('/post/:postId', require(__dirname + '/routes/post'));

app.get('*', require(__dirname + '/routes/default'));

app.listen(process.env.PORT);