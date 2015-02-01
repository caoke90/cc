var cc=console
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat', {
	 title: String,//标题
	 info:String,//内容
	 summary:String
 });

var kitty = new Cat({
	 title: 'Zildjian' ,
	 info:"infoeinfoeinfoeinfoeinfoe",
	 summary:"dddd"
});
Cat.find({title:"Zildjian"},function (err,data) {
	cc.log(data)
});
var api={
	
}