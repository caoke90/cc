/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./mycollection.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            this._super()
            if(!this.data1){
                this.data1={}
                this.getdata1()
                return;
            }else{
                cc.log(this.data1)
                this.data1.dataArr=[]
                for(var i=1;i<=this.data1.total;i++){
                    this.data1.dataArr.push(this.data1["data"+i])
                }
//                var obj=JSON.parse(this.data1)
                cc.log(this.data1)
            }
            //转化成数组
            this.data={
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
//            this.showdialogSuccess()
        },
        //查看课程被收藏数
        getdata1:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/conllect/getconlist",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "order":1
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data1=data.content.data
                        the.restart()
                    }else{
                        the.showdialog2(data.msg)
                        cc.log("wrong")
                    }
                },
                error:function(data){
                    the.showdialog2("请求超时")
                }
            })
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
        },
        //重新渲染
        restart:function(data){
            this.onExit()
            this.init()
            this.onEnter()
        },
        //提交数据
        initAnimate:function(){
            var the=this;
            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();
        }
    })

    module.exports=Scene
});
