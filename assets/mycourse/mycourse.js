/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./mycourse.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            //历史
            if(!this._once1){
                this._once1=true;
                this.list1=[]
                this.data1={
                    type:"jsonp",
                    period:-1,
                    pageNo:0,
                    pageSize:10
                }
                this.getdata1()
            }
            //今日
            if(!this._once2){
                this._once2=true;
                this.data2={
                    type:"jsonp",
                    period:0,
                    pageNo:0,
                    pageSize:10
                }
                this.list2=[]
                this.getdata2()
            }
            //将要
            if(!this._once3){
                this._once3=true;
                this.data3={
                    type:"jsonp",
                    period:1,
                    pageNo:0,
                    pageSize:10
                }
                this.list3=[]
                this.getdata3()
            }
            this._super()
            //转化成数组
            this.data={
                url:location.href
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
//            this.showdialogSuccess()
        },
        //历史
        getdata1:function(callback){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/myCourse",
                dataType : "jsonp",
                data:the.data1,
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        if(data.content&&data.content.dataList){
                            the.list1=the.list1.concat(data.content.dataList)
                            the.restart()
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
        //今日
        getdata2:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/myCourse",
                dataType : "jsonp",
                data:the.data2,
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        if(data.content&&data.content.dataList){
                            the.list2=the.list2.concat(data.content.dataList)
                            the.restart()
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
        //将要
        getdata3:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/myCourse",
                dataType : "jsonp",
                data:the.data3,
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        if(data.content&&data.content.dataList){
                            the.list3=the.list3.concat(data.content.dataList)
                            the.restart()
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
            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();

            //切换
            $(".blo3 .text",the.context).each(function(k,v){
                $(this).on("click",function(){
                    $(".blo3 .text",the.context).removeClass("on")
                    $(this).addClass("on")
                    $(".textlist",the.context).hide()
                    $(".textlist",the.context).eq(k).show()
                })
            })
            $(".blo3 .text.on",the.context).trigger("click")
        }
    })

    module.exports=Scene
});
