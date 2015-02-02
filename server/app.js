//global
require("cc")
//public
var express = require('express');
app =express();
app.listen(3000);

//private
app.use("/api/:path",function(req, res, next){
	require("./mysql/"+req.params.path)(req,res)
	cc.log(req.url)
});

app.get("/a",function(req,res){
	res.send(req.url)
})