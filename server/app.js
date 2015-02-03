//global
require("cc")
require("jquery")
//public
var express = require('express');

var scene=cc.Node.extend({
    app:null,
    init:function(){
        this._super()
        this.app =express();

        this.animation()
    },
    animation:function(){
        //private
        this.app.use("/api/:path",function(req, res, next){
            require("./mysql/"+req.params.path)(req,res)
            cc.log(req.url)
        });
    },
    onEnter:function(){
        this._super()
        this.app.listen(3000);
    }
})

var node=new scene()
node.init()
node.onEnter()