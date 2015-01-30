/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./mycol.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            this._super()

            if(!this.data1){
                this.pageNum=1
                this.data1={}
                this.data1.data=[]
                this.getdata1()
            }

            //转化成数组
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

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
                async:false,
                data:{
                    type:"jsonp",
                    "order":the.pageNum
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        if(data.content&&data.content.data){
                            //更多
                            if(data.content.data.length>0){
                                data.content.data=the.data1.data.concat(data.content.data)
                                the.data1= data.content
                                the.restart()
                            }else{
                                the.showdialog2("没有收藏的课程")
                            }
                        }

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
        //提交数据
        initAnimate:function(){
            var the=this;
//            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();
            //加载更多
            $("#addmore",the.context).on("click",function(){
                the.pageNum++
                the.getdata1()
            })
        }

    })

    module.exports=Scene
});
