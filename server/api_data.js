var Tiny=require("tiny")
[{
	url:"table1.tiny",
	data:{
			title: 'the title',
			content: 'the content'
		},
	end:function(){
		var the=this
		return function(callback){
			Tiny(the.url, function(err, db) {
				db.get("name",callback);
			})
		}
	}
},
{
	
}]


api.end()(function(err,data){
	console.log(err)
	console.log(data)
})