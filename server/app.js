//global
require("cc")
//public
var express = require('express');
global.app =express();
app.listen(80);

cc.log(21)
//private
app.use("/api/:path",function(req, res, next){
	var Node=require("./jiekou1")
	var node=new Node()
	node.init(req,res)
	
});

app.get("/a",function(req,res){
	res.send(req.url)
})