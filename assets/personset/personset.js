/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./personset.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            this._super()
            if(!this._once1){
                this._once1=true;
                this.data1={}
                this.getdata1()
            }
            //今日
            if(!this._once2){
                this._once2=true;
                this.data2={}
                this.getdata2()
            }
            //转化成数组
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
        },
        //获取用户信息
        getdata2:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/target/getLessonById",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    id:"138"
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data2=data.content
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
        //获取用户信息
        getdata1:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/myinfo/getinfo",
                dataType : "jsonp",
                data:{
                    type:"jsonp"
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data1=data.content

                        cc.log(the.data1)
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
        //提交数据
        initAnimate:function(){
            var the=this;
            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();

            $("#tijiao",the.context).on("click",function(){
                $.ajax({
                    url:weixinUrl+"/myinfo/saveinfo",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        savetype:"1",
                        realName:$("#realName",the.context).val(),
                        sex:$("#sex",the.context).val(),
                        region:$("#region",the.context).val(),
                        // mobile:$("#mobile",the.context).val(),
                        address:$("#address",the.context).val()
                    },
                    success:function(data){
                        if(data.code==0){
                            cc.log("right")
                            the.showdialog2("设置成功");
                            history.go(-1);
                        }else{
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.showdialog2("请求超时")
                    }
                })
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
        }
    })

    module.exports=Scene
});
