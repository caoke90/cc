/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){
    cc.log(location.href)
//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./bindlogin3.html"),
        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data=data||{
                content:[]
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            this.initAnimate()
            if(!data){
                //没有数据，重新渲染
                this.getJsonp()
            }
        },
        //交互事件
        initAnimate:function(){
            var the=this


        },
        //重新渲染页面
        renderData:function(data){
            var parent= this.getParent()
            this.removeFromParent()
            var sprite=new Scene()
            sprite.body=this.body
            sprite.init(data)
            parent.addChild(sprite)
        },
        //获取数据
        getJsonp:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/target/getStages",
                dataType : "jsonp",
                data:{
                    type:"jsonp"
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.renderData(data)
                    }else{
                        the.showdialog2(data.msg)
                        cc.log("wrong")
                    }
                },
                error:function(data){
                    the.showdialog2("请求数据超时")
                }
            })
        }
    })

    module.exports=Scene
});
