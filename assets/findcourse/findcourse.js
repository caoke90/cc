/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){
    cc.log(location.href)
    //搜索key记录
    var searchInfo=cc.Div.extend({
        tpl:'<div class="col-xs-12" emit="info"><span class="col-xs-11"><%-value%></span><span class="fui-cross-circle"></span></div>',
        init:function(data,tpl){
            this._super()
            this.data={value:data }
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")
            var the=this
            $(".fui-cross-circle",the.context).on("click",function(){
                var parent=the.getParent()
                cc.ArrayRemoveObject(parent.recordDate,data)
                parent.updateRecord()
                the.removeFromParent()
                if(parent.recordDate.length==0){
                    $(".blo2",parent.context).slideUp()
                }
                return false;
            })
            $(".col-xs-11",the.context).on("click",function(){
                $("#input",parent.context).val($(this).text())
                $(".blo2",parent.context).hide()
                return false;
            })
        }
    })
//搜索内容
    var Info=cc.Div.extend({
        tpl:require("./list.html"),
        init:function(data,tpl){
            this._super()
            this.data=data
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

        }
    })
    //导航分类
    var Nav=cc.Div.extend({
        tpl:require("./nav.html"),
        len:0,
        len2:0,
        init:function(data,tpl){
            this._super()

            var the=this
            //获取导航
            if(!this.listitems){
                async.series({
                    parent:this.getparentJsonp(-1)
                },function(err,results){
                    the.listhead=results.parent
                    if(!the.listitems){
                        var arr=[]
                        $(results.parent.content).each(function(k,v){
                            arr.push(the.getparentJsonp(v.id))
                        })
                        async.series(arr,function(err,results2){
                            the.listitems=results2
                            the.restart()
                        })
                    }
                })
                return;
            }
            cc.log(this.listhead)
            cc.log(this.listitems)

            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            $(".listhead li",the.context).each(function(k,v){
                $(this).on("click",function(){
                    the.getParent().searchMulu($(this).attr("query"))
                    $(".listhead li",the.context).removeClass("on")
                    $(this).addClass("on")
                    $(".listitem",the.context).hide()
                    $(".listitem",the.context).eq(k).show()
                    return false
                })
            })
            $(".listitem li",the.context).each(function(){
                $(this).on("click",function(){
                    the.getParent().searchMulu($(this).attr("query"))
                    $(".listitem li",the.context).removeClass("on")
                    $(this).addClass("on")
                    return false
                })
            })
        },
        //获取数据
        getparentJsonp:function(id){
            var the=this;
            return function(callback){
                $.ajax({
                    url:weixinUrl+"/dc/courseCategory",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        parentId:id||-1
                    },
                    success:function(data){
                        if(data.code==0){
                            callback(null,data)
//                            the.len=data.content.length
//                            if(data.content.length>0){
//                                the.data.listhead[0]=data.content
//                                for(var i=0;i<data.content.length;i++){
//                                    the.getChildJsonp(data.content[i].id,i+1)
//                                }
//                            }
                        }else{
                            callback(data.msg)
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.showdialog2("请求数据超时")
                    }
                })
            }

        }

    })

    var Scene=cc.Div.extend({
        tpl:require("./findcourse.html"),
        data:null,
        body:"body",
        init:function(data,tpl){
            this._super()
            this.type="search";
            //默认搜索条件
            this.data1={
                type:"jsonp",
                query:getQueryString("query")||"",
                sortField:"1",
                from:"0",
                size:"6"
            }

            this.data2={
                type:"jsonp",
                firstLevel:"0",
                secondLevel:"0",
                sortField:"1",
                priceType:"-1",
                from:"0",
                pageSize:"6"
            }

            //转化成数组
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");

            var node=new Nav()
            node.init()
            this.addChild(node)

            this.searchJsonp()
            this.initAnimate()
            this.nodeArr1=[]
            this.nodeArr2=[]
        },
        //搜索目录
        searchMulu:function(query){
            this.type="mulu";
            var arr=query.split("_")
            this.data2.firstLevel=arr[0]
            this.data2.secondLevel=arr[1]
            this.searchJsonp()
        },
        //滚动加载数据
        addJsonp:function(){
            if(this.type=="search"){
                var the=this;
                this.data1.from+=3
                $(".loadbtn",the.context).hide()
                $(".loading",the.context).show()
                $.ajax({
                    url:weixinUrl+"/dc/searchCourse",
                    dataType : "jsonp",
                    data:the.data1,
                    success:function(data){
                        if(data.code==0){
                            if(data.content.resultList&&data.content.resultList.length>0){
                                var node=new Info()
                                node.init(data)
                                the.addChild(node)
                                the.nodeArr2.push(node)

                                if(data.content.resultList.length==the.data1.size){
                                    the.loading=false
                                    $(".loadbtn",the.context).show()
                                    $(".loading",the.context).hide()
                                }else{
                                    the.loading=true
                                    $(".loading",the.context).text("没有更多内容了")
                                    $(".loadbtn",the.context).off("click")
                                }
                            }else{
                                the.loading=true
                                $(".loading",the.context).text("没有更多内容了")
                                $(".loadbtn",the.context).off("click")
                            }
//                        the.renderData(data)
                        }else{
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.showdialog2("请求数据超时")
                    }
                })
            }else{
                var the=this;
                this.data2.from+=3
                $(".loadbtn",the.context).text("正在加载请稍后……")
                $.ajax({
                    url:weixinUrl+"/dc/listCourse",
                    dataType : "jsonp",
                    data:the.data2,
                    success:function(data){
                        if(data.code==0){
                            if(data.content.resultList&&data.content.resultList.length>0){
                                var node=new Info()
                                node.init(data)
                                the.addChild(node)
                                the.nodeArr2.push(node)
                                if(data.content.resultList.length==the.data2.size){
                                    the.loading=false
                                    $(".loadbtn",the.context).show()
                                    $(".loadbtn",the.context).text("点击加载更多")
                                }else{
                                    the.loading=true
                                    $(".loadbtn",the.context).text("没有更多内容了")
                                    $(".loadbtn",the.context).off("click")
                                }
                            }else{
                                the.loading=true
                                $(".loadbtn",the.context).text("没有更多内容了")
                                $(".loadbtn",the.context).off("click")
                            }
//                        the.renderData(data)
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
        },

        //获取搜索数据
        searchJsonp:function(){
            if(this.type=="search"){
                var the=this;
                this.data1.from=0;
                $.ajax({
                    url:weixinUrl+"/dc/searchCourse",
                    dataType : "jsonp",
                    data:the.data1,
                    success:function(data){
                        if(data.code==0){
                            if(data.content.resultList){
                                cc.localStorage("searchkey",the.data1.query)
                                $(the.nodeArr2).each(function(k,v){
                                    v.removeFromParent()
                                })
                                the.nodeArr2=[]
                                var node=new Info()
                                node.init(data)
                                the.addChild(node)
                                the.nodeArr2.push(node)
                                if(data.content.resultList.length==the.data1.size){
                                    the.loading=false
                                    $(".loadbtn",the.context).show()
                                }else{
                                    the.loading=true
                                    $(".loadbtn",the.context).hide()
                                }
                            }else{
                                the.showdialog2("没有搜索到"+the.data1.query+" 的相关内容")
                            }
                            cc.log(data)
//                        the.renderData(data)
                        }else{
                            the.showdialog2(data.msg)
                            cc.log("wrong")
                        }
                    },
                    error:function(data){
                        the.showdialog2("请求数据超时")
                    }
                })
            }else{
                var the=this;
                this.data2.from=0;
                $.ajax({
                    url:weixinUrl+"/dc/listCourse",
                    dataType : "jsonp",
                    data:the.data2,
                    success:function(data){
                        if(data.code==0){
                            if(data.content.resultList){
                                $(the.nodeArr2).each(function(k,v){
                                    v.removeFromParent()
                                })
                                the.nodeArr2=[]
                                var node=new Info()
                                node.init(data)
                                the.addChild(node)
                                the.nodeArr2.push(node)
                                cc.log(data.content.resultList.length)
                                cc.log(the.data1.size)
                                if(data.content.resultList.length==the.data1.size){
                                    the.loading=false
                                    $(".loadbtn",the.context).show()
                                }else{
                                    the.loading=true
                                    $(".loadbtn",the.context).hide()
                                }
                            }else{
                                the.showdialog2("没有搜索到 分类相关的内容")
                            }

//                        the.renderData(data)
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

        },
        //交互事件
        initAnimate:function(){
            var the=this
            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();
            //搜索框
            the.recordDate=[]
            if(cc.localStorage("recordDate")){
                the.recordDate=cc.localStorage("recordDate").split(",")
            }
            cc.log(the.recordDate)
            the.recordNum=the.recordDate.length
            //输入框
            $("#reset",the.context).hide()
            $("#input",the.context).on("input",function(){
                if($(this).val().length>0){
                    $("#reset",the.context).show()
                }else{
                    $("#reset",the.context).hide()
                }
                the.recordNum=the.recordDate.length
                if(the.recordDate.length>0){
                    $(the.nodeArr1).each(function(k,v){
                        v.removeFromParent()
                    })
                    the.nodeArr1=[]
                    for(var i=0;i<the.recordDate.length;i++){
                        if(the.recordDate[i].indexOf($(this).val())>-1){
                            var node=new searchInfo()
                            node.init(the.recordDate[i])
                            the.addChild(node)
                            the.nodeArr1.push(node)
                        }
                    }
                    $(".blo2",the.context).slideDown()

                    $(window).on("click",function(e){
                        $(".blo2",the.context).hide()
                        $(window).off("click")
                        return false;
                    })
                }else{
                    $(".blo2",the.context).hide()
                }
                return false;
            }).on("click",function(){
                    return false;
                })

            $('#input',the.context).on('keypress',function(event){
                if(event.keyCode == "13")
                {
                    $("#search",the.context).trigger("click")
                }
            });
            //搜索
            $("#search",the.context).on("click",function(){
                $(".blo2",the.context).hide()
                if($("#input",the.context).val()){
                    cc.ArrayRemoveObject(the.recordDate,$("#input",the.context).val())
                    the.recordDate.push($("#input",the.context).val())
                    the.updateRecord()
                    the.data1.query=$("#input",the.context).val()
                    location.href="?file=findcourse&query="+escape(the.data1.query)
                }
            })
            //按销量
            $("#anxiaoliang",the.context).on("click",function(){
                the.data1.sortField=3
                the.data2.sortField=3
                the.searchJsonp()
                $(".on",the.context).removeClass("on")
                $(this).addClass("on")
            })
            //按价格
            $("#anjiage",the.context).on("click",function(){
                the.data1.sortField=2
                the.data2.sortField=2
                the.searchJsonp()
                $(".on",the.context).removeClass("on")
                $(this).addClass("on")
            })
            //清除所有记录
            $("#clear",the.context).on("click",function(){
                the.recordDate=[]
                $(".blo2",the.context).hide()
                the.updateRecord()
                return false;
            })
            //重新输入
            $("#reset",the.context).on("click",function(){
                $("#input",the.context).val("")
                $("#input",the.context).trigger("focus")
                $(this).hide()
                return false;
            })
            //下拉导航
            $("#alllist",the.context).on("click",function(){
                $(".on",the.context).removeClass("on")
                $(this).addClass("on")
                if($(".bggray",the.context).css("display")=="none"){
                    $(".bggray",the.context).show()
                    $(".blo5",the.context).show()
                    return false;
                }
            })
            $("#alllist .text",the.context).on("click",function(){
                the.searchMulu("0_0")
            })

            $(".conte",the.context).on("click",function(){
                if($(".bggray",the.context).css("display")=="block"){
                    $(".bggray",the.context).hide()
                    $(".blo5",the.context).hide()
                }
            })

            //下滑加载数据+
            the.loading=false;
            $(window).on("scroll",function(e){
                if( $(window).scrollTop() + $(window).height() >= $(document).height() ){
                    if(!the.loading){
                        the.loading=true
                        the.addJsonp()
                        cc.log("加载数据")
                    }
                }
            })
            $(".loadbtn",the.context).on("click",function(){
                if(!the.loading){
                    the.loading=true
                    the.addJsonp()
                    cc.log("加载数据")
                }
            })

        },
        //更新本地数据库
        updateRecord:function(){
            var the=this
            the.recordDate.sort(function(p1,p2){
                return p1.length>p2.length
            })
            cc.localStorage("recordDate",the.recordDate)
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
