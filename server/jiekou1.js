
var scene=cc.Node.extend({
	init:function(req,res){
		res.send(req.params.path)
	}
})
module.exports=scene;
/*	var async=require("async")
	var app=global.app
		console.log(2121)
app.use("/api/:path",function(req, res, next){
	console.log(req.url)
	var path=require(req.params.path)

	
	async.series([function(callback){
		callback(null,{"name":"caoke",url:req.params.path})
	}],function(err,results){
		cc.log(results)
		res.jsonp(results)
	})
	
	
});
*/