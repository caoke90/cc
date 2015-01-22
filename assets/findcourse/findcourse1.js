/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./findcourse1.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            this._super()
            if(!this.data){
                this.getjsonp()
                return;
            }
            if(!this.data1){
                this.getbuy()
                return;
            }
            this.data.isbuy=this.data1.content

            if(!this.data2){
                this.getdata2()
                return;
            }
            this.data.conllectnumber=this.data2.content

            if(!this.data3){
                this.getdata3()
                return;
            }
            if(this.data3.content=="1"){
                this.data.isconllect=false
            }else{
                this.data.isconllect=true
            }
            //转化成数组
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()

        },
        //查看课程被收藏数
        getdata3:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/conllect/isconllect",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "productid":getQueryString("productId")
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data3=data
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
        //查看课程被收藏数
        getdata2:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/conllect/getnumber",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "productid":getQueryString("productId")
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data2=data
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
        //获取是否购买
        getbuy:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/isBuy",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "productId":getQueryString("productId")
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data1=data
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
        //重新渲染
        restart:function(data){
            this.onExit()
            this.init()
            this.onEnter()
        },
        //获取课程详情
        getjsonp:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/courseDetail",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "productId":getQueryString("productId")
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.data=data
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
        //领取成功
        showdialogSuccess:function(mes,dom){
            var d =dialog({
                title:"领取成功！",
                content: "请关注我的课程和通知，不要翘课哦：）",
                okValue:"确定",
                ok:true
            })
            d.show();
        },
        //页面交互
        initAnimate:function(){
            var the=this;
            cc.log(the.data.isconllect)
            //收藏
            $(".shoucang",the.context).each(function(){
                if(the.data.isconllect){
                    $(this).addClass("red")
                    $(".text",this).text("取消")
                }else{
                    $(this).removeClass("red")
                    $(".text",this).text("收藏")
                }
                $(this).on("click",function(e){
                    if(!the.lock){
                        the.lock=true;
                        the.data.isconllect=!the.data.isconllect
                        the.conllect(the.data.isconllect)
                        if( $(".text",this).text()=="收藏"){
                            $(this).addClass("red")
                            $(".text",this).text("取消")
                        }else{
                            $(this).removeClass("red")
                            $(".text",this).text("收藏")
                        }
                    }
                })
            })
            //slide
            $(".blo3 .col-xs-4",the.context).each(function(k){
                $(this).on("click",function(){
                    $(".blo4 .item",the.context).hide()
                    $(".blo4 .item",the.context).eq(k).show()
                    return false;
                })
            })
        },
        conllect:function(state){
            var the=this
            if(state){
                $.ajax({
                    url:weixinUrl+"/conllect/save",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        productid:getQueryString("productid")
                    },
                    success:function(data){
                        the.lock=false;
                        if(data.code==0){
                            cc.log("right")
                        }else{
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.lock=false;
                        the.showdialog2("请求超时")
                    }
                })
            }else{
                $.ajax({
                    url:weixinUrl+"/conllect/unsave",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        productid:getQueryString("productid")
                    },
                    success:function(data){
                        the.lock=false;
                        if(data.code==0){
                            cc.log("right")
                        }else{
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.lock=false;
                        the.showdialog2("请求超时")
                    }
                })
            }

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
