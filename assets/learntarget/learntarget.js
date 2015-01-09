/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./learntarget.html"),

        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data={
                url:location.href
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("jquery.cookie");
            require("dialog-min");
            require("ui-dialog.css");
           this.initAnimate()
        },
        //提交数据
        initAnimate:function(){
            var the=this;

        },
        //设置coolie
        setCookie:function(json){

            if(typeof json=="string"){
                json=JSON().parse(json)
            }
            for(var k in json){
                $.cookie(k,json[k])
            }
        },
        //气泡提示
        showdialog1:function(mes,dom){
            var d =dialog({
                content: mes,
                quickClose: true// 点击空白处快速关闭
            })
            d.show($(dom)[0]);
            setTimeout(function () {
                d.close().remove();
            }, 2000);
        },
        //弹窗提示
        showdialog2:function(mes,dom){
            var d = dialog({
                content:mes
            });
            d.show();
            setTimeout(function () {
                d.close().remove();
            }, 2000);
        }
    })

    module.exports=Scene
});
