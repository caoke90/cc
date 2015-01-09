/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    require("../cc.Read")
    require("./cc.Listen")

    var Layer2=cc.Div.extend({
        tpl:require("./layer2.tpl"),
        //这里不能赋值对象或者数组
        state:null,
        data:null,
        pageArr:null,
        index:0,
        init:function(data,tpl){
            var the = this;
            this._super()
            this.data=data
            this.context=$("<div>"+ejs.render(tpl||this.tpl,this.data)+"</div>")
            this.pageArr=[]
            this.state={replaying:true}
            for(var i=0;i<this.data.word.length;i++){
                var sprite=cc.Listen.create(this.data.word[i])
                this.addChild(sprite)
            }
            this.pageArr=this.getChildren();
            this.initMenu();
        },
        initMenu:function(){
            var the=this;
            $(".page .prev",the.context).on("click",function(){
                //如果第一页
                if(the.index==0){
                    return;
                }
                the.jumpto(the.index-1)
            });
            $(".page .next",the.context).on("click",function(){
                //如果最后一页
                if(the.index==the._children.length-1){
                    return;
                }
                the.jumpto(the.index+1)
            });
            $(".endAnswer .cxdt",the.context).on("click",function(){
                $(".listen .module li").removeClass();//重新答题，全部删除class
                var parent=the.getParent()
                the.removeFromParent();  //删除所有的类
                parent.replay(); //重新初始化
            })

        },
        onEnter:function(){
            this._super()   //页面渲染完
            this.initPage()   //页面初始化
        },
        //页面初始化
        initPage:function(){
            var the=this
            for(var i=0;i<this.pageArr.length;i++){
                this.pageArr[i].context.hide()
            }
            this.pageArr[this.index].context.show()
            this.jumpto(this.index);
        },
        //显示答案
        showAnswer:function(disable){
            var the=this
            the.state.replaying=false
            $(this.pageArr).each(function(k,v){
                v.showAnswer(disable)
            })
        },
        //跳到页面
        jumpto:function(index){
            this.pageArr[this.index].context.hide()
            this.index=index;
            if (this.index < 0){
                this.index += this.pageArr.length;
            }else{
                this.index = this.index % this.pageArr.length;
            }
            this.pageArr[this.index].context.show()

            this.pageShow();
        },
        //页面显示判断
        pageShow:function(){
            var the=this;
            $(".page .text",this.context).text((this.index+1)+"/"+this.pageArr.length);
            if(this.state.replaying){/*回答中*/
                $(".page .prev",the.context).hide();
                $(".page .next",the.context).hide();
                $(".endAnswer",the.context).hide();
            }else{
                if(the.index==the.pageArr.length-1){
                    $(".endAnswer",the.context).show();
                }else{
                    $(".endAnswer",the.context).hide();
                }
                $(".page .prev",the.context).show();
                $(".page .next",the.context).show();
            }
        },
        //上一页
        prev:function(){
            this.jumpto(this.index-1)
        },
        //下一页
        next:function(){
            var the=this
            //如果是最后一页，答题结束
            if(the.index == the.pageArr.length-1){
                the.state.replaying=false
                the.pageShow()
            }else{
                setTimeout(function(){
                    the.jumpto(the.index+1);
                },1000);
            }

        }
    })
    Layer2.create=function(data,tpl){
        var sprite=new Layer2
        sprite.init(data,tpl)
        return sprite
    }
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./MyScene.tpl"),
        //这里不能赋值对象或者数组
        state:null,
        data:null,
        pageArr:null,
        index:0,
        init:function(data,tpl){
            this._super()
            this.data=data
            this.textSelect=[]
            this.pageArr=[]
            if(this.data.lecture){
                var sprite=cc.Read.create(this.data.lecture)
                this.addChild(sprite)
                this.textSelect.push("讲义")
            }
            if(this.data.practice){
                var sprite=Layer2.create(this.data.practice)
                this.addChild(sprite)
                this.pageArr.push(sprite)
                this.textSelect.push("习题")
            }
            this.context=$("<div>"+ejs.render(tpl||this.tpl,this)+"</div>")
            this.pageArr=this._children;
            this.initMenu()
        },
        initMenu:function(){
            var the=this
            $(".nav .title li",the.context).eq(the.index).addClass("on")
            $(".nav .title li",the.context).each(function(i){
                $(this).on("click",function(){
                    if(i>=the.pageArr.length){cc.log("无页面");return;}
                    $(".nav .title li",the.context).eq(the.index).removeClass("on")
                    $(".nav .title li",the.context).eq(i).addClass("on")
                    the.jumpto(i);
                    the.pageArr[0].pauseVideo();//切换的时候，关闭未播放完的声音
                })
            })
        },
        jumpto:function(index){
            this.pageArr[this.index].context.hide()
            this.index=index;
            this.pageArr[this.index].context.show()
        },
        onEnter:function(){
            this._super()

            this.initPage()
            this.afterHtml()
        },
        //初始化
        replay:function(){
            var layer=Layer2.create(this.data.practice)
            this.addChild(layer)
            this.pageArr[1]=layer
        },
        //页面初始化
        initPage:function(){
            for(var i=0;i<this.pageArr.length;i++){
                this.pageArr[i].context.hide()
            }
            this.pageArr[this.index].context.show()
        },
        afterHtml:function(){
            var ctx=this.context
            $(".container",ctx).css({
                "margin-top":$("header",ctx).height()
//                "height":$(ctx).height()-$("header",ctx).height()-$("footer",ctx).height()
            })
            //在网页端
            if (!navigator.userAgent.match(/mobile/i)) {
                $("body").css({
                    "overflow":"scroll"
                })
                $(".container",ctx).css({
                    "margin-bottom":$("footer",ctx).height()+100
                })
            }
        }
    })
    Scene.create=function(data,tpl){
        var sprite=new Scene
        sprite.init(data,tpl)
        return sprite
    }
    module.exports=Scene
});
