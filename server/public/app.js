
var express = require('express');
var app =express();
app.use(express.static(__dirname + '/public'));
// 一个简单的 logger
app.use(function(req, res, next){
	if(req.url=="/dd"){
		res.send('Hello World');
	
		}
			return;
  console.log('%s %s', req.method, req.url);
  next();
});

// 响应
app.use(function(req, res, next){
  res.send('Hello World');
});

app.listen(3000);