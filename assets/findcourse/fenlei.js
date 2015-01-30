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
        init:function(data,qid){
            this._super()
            this.qid=qid
            this.data1={
                type:"jsonp",
                parentId:qid||-1
            }
            if(!data){
                this.data={}
                this.data.listhead=[]
                this.getparentJsonp()
                return;
            }
            this.data=data
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")
            var the=this

            $(".listhead li",the.context).each(function(k,v){
                $(this).on("click",function(){
                    $(".listhead li",the.context).removeClass("on")
                    $(this).addClass("on")
                    $(".listitem",the.context).hide()
                    $(".listitem",the.context).eq(k).show()
                    return false
                })
            })
        },
        //获取数据
        getparentJsonp:function(id){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/courseCategory",
                dataType : "jsonp",
                data:this.data1,
                success:function(data){
                    if(data.code==0){
                        the.len=data.content.length
                        if(data.content.length>0){
                            the.data.listhead[0]=data.content
                            for(var i=0;i<data.content.length;i++){
                                the.getChildJsonp(data.content[i].id,i+1)
                            }

                        }
                    }else{
                        the.showdialog2(data.msg)
                        cc.log("wrong")
                    }
                },
                error:function(data){
                    the.showdialog2("请求数据超时")
                }
            })
        },
        getChildJsonp:function(id,i){
            var the=this;
            $.ajax({
                url:weixinUrl+"/dc/courseCategory",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    parentId:id
                },
                success:function(data){
                    the.len2++
                    if(data.code==0){
                        cc.log("right")
                        the.data.listhead[i]=data.content
                        the.renderData()
                    }else{
                        the.showdialog2(data.msg)
                        cc.log("wrong")
                    }
                },
                error:function(data){
                    the.len2++
                    the.showdialog2("请求数据超时")
                }
            })

        },
        //重新渲染页面
        renderData:function(){
            var the=this
            if(the.len2==the.len){
                var parent= this.getParent()
                this.removeFromParent()
                var sprite=new Nav()
                sprite.init(the.data,the.qid)
                parent.addChild(sprite)
            }

        }

    })

    var Scene=cc.Div.extend({
        tpl:require("./fenlei.html"),
        data:null,
        body:"body",
        init:function(data,tpl){
            this._super()
            var arr=[]
            if(getQueryString("query")){
               arr =getQueryString("query").split("-")
            }
            //默认搜索条件
            this.data1={
                type:"jsonp",
                firstLevel:arr[0]||"",
                secondLevel:arr[1]||"",
                priceType:"-1",
                from:"0",
                pageSize:"6"
            }
            //转化成数组
            this.data=data||{
                content:[],
                data1:this.data1
            }

            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");

            var node=new Nav()
            node.init(null,-1)
            this.addChild(node)

            this.searchJsonp()
            this.initAnimate()
            this.nodeArr1=[]
            this.nodeArr2=[]

//            if(!data){
//                //没有数据，重新渲染
//                this.getJsonp()
//            }

//
        },
        //滚动加载数据
        addJsonp:function(){
            var the=this;
            this.data1.from+=3
            $.ajax({
                url:weixinUrl+"/dc/listCourse",
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
                            }else{
                                the.loading=true
                                $(".loadbtn",the.context).text("没有更多内容了")
                            }
                        }else{
                            the.loading=true
                            $(".loadbtn",the.context).text("没有更多内容了")
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
        },
        //获取搜索数据
        searchJsonp:function(){
            var the=this;
            this.data1.from=0;

            $.ajax({
                url:weixinUrl+"/dc/listCourse",
                dataType : "jsonp",
                data:the.data1,
                success:function(data){
                    if(data.code==0){
                        if(data.content.resultList&&data.content.resultList.length>0){
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
                            the.showdialog2("没有搜索到相关内容")
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
            //按免费
            $("#anxiaoliang",the.context).on("click",function(){
                the.data1.priceType=0
                the.searchJsonp()
                $(".text.on",the.context).removeClass("on")
                $(".text",this).addClass("on")
            })
            //按收费
            $("#anjiage",the.context).on("click",function(){
                the.data1.priceType=1
                the.searchJsonp()
                $(".text.on",the.context).removeClass("on")
                $(".text",this).addClass("on")
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
                $(".bggray",the.context).show()
                $(".blo5",the.context).show()
                $("body").on("click",function(){
                    $(".bggray",the.context).hide()
                    $(".blo5",the.context).hide()
                    $("body").off("click")
                })
                return false
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
