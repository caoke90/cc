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
        tpl:require("./fail.html"),
        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data=data||{
                content:[]
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            this.initAnimate()

        },
        //交互事件
        initAnimate:function(){
            var the=this


        }
    })

    module.exports=Scene
});
