/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./xiangq.html"),
        body:"body",
        data:null,
        init:function(data,tpl){
            this._super()
            //详情
            if(!this.data){
                this.getjsonp()
                return;
            }
            this.productid=getQueryString("productId")||"0"
            //获取学堂数据
            cc.log(this.data.content.createUserId)
            if(!this._once&&(this._once=!this._once)){
                this.xuetang={
                    "hallSummary":"默认学堂介绍内容",
                    "teacherSummary":"默认教师介绍内容"
                }
                this.getXuet()
            }
            //是否购买
            if(!this._once1&&(this._once1=!this._once1)){
                this.islogin=false
                this.isbuy=false
                this.getbuy()
            }

//            是否已收藏
            if(this.islogin){
                if(!this._once2&&(this._once2=!this._once2)){
                    this.getdata3()
                }
            }else{
                this.isconllect=false
            }
            //转化成数组
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()

        },
        //获取学堂数据
        getXuet:function(){
            var the=this
            $.ajax({
                url:weixinUrl+"/dc/courseIntro",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "teacherId":the.data.content.createUserId
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.xuetang=data.content
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
                        if(parseInt(data.content)){
                            the.isconllect=true
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
                        the.islogin=true;
                        cc.log("right")
                        the.isbuy=data.content
                        the.restart()
                    }else if(data.code=="3007"){
                        the.islogin=false

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
                    console.log(data);
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
            //收藏
            $(".shoucang",the.context).each(function(){
                if(the.isconllect){
                    $(this).addClass("red")
                    $(".text",this).text("取消")
                }else{
                    $(this).removeClass("red")
                    $(".text",this).text("收藏")
                }
                $(this).on("click",function(e){
                    if(!the.islogin){
                        the.showdialog4()
                        return;
                    }
                    if(!the.lock){
                        the.lock=true;
                        the.isconllect=!the.isconllect
                        the.conllect(the.isconllect)
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
                    $(this)
                        .siblings().removeClass('active')
                        .end()
                        .addClass('active');
                    $(".blo4 .item",the.context).hide()
                    $(".blo4 .item",the.context).eq(k).show()
                    return false;
                })
            })

            $("#mianfei",the.context).on("click",function(){
                if(!the.islogin){
                    the.showdialog4()
                    return;
                }
                var dom=this
                $.ajax({
                    url:weixinUrl+"/dc/takeFreeCourse",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        "productId":getQueryString("productId")
                    },
                    success:function(data){
                        console.log(data);
                        if(data.code==0){
                            $(dom).off("click")
                            $(dom).text("已购买")
                            the.showdialog2("恭喜！成功领取课程")
                        }else if(data.code==3007){
                            the.showdialog2("用户没有登陆,请登陆后领取")
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
                            the.data.content.collectCount+=1
                            $("#shoc",the.context).text(the.data.content.collectCount+"人收藏")
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
                            the.data.content.collectCount-=1
                            $("#shoc",the.context).text(the.data.content.collectCount+"人收藏")
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
        },
        showdialog4:function(){
            var the=this;
            var d = dialog({
                content:"用户没有登陆，点击确认进入登陆页面,3秒后自动跳转",
                okValue:"确认",
                cancelValue:"取消",
                cancel:true,
                ok:function(){
                    location.href="bindlogin.html?next_page="+location.href
                }

            });
            d.show();
        }
    })

    module.exports=Scene
});
