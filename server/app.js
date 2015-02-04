//global
require("cc")
express = require('express');
$=require("cheerio")
async = require("async");

//public
var scene=cc.Snode.extend({
    app:null,
    init:function(){
        this._super()
        //初始化
        this.app =express();

        //交互事件
        this.animation()
    },
    //交互事件
    animation:function(){
        //触发接口
        this.app.use("/api/:path",function(req, res, next){
            require("./mysql/"+req.params.path)(req,res)
            cc.log(req.url)
        });
    },
    //监听
    onEnter:function(){
        this._super()
        this.http=this.app.listen(3000);
    },
    //退出
    onExit:function(){
        this._super()
        this.http.close()
    }
})

var node=new scene()
node.init()
cc.Director.replaceScene(node)