/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){
    cc.Listen=cc.Div.extend({
        tpl:require("./cc.listen.tpl"),
        //这里不能赋值对象或者数组
        state:null,
        data:null,
        init:function(data,tpl){
            this._super();
            this.data=data|| {
                "audio": "shuai.mp3",
                "title": "yes",
                "options": [{
                    "text": "yes",
                    "isRight": 1
                }, {
                    "text": "no",
                    "isRight": 0
                }]
            }
            this.context=$("<div>"+ejs.render(tpl||this.tpl,this.data)+"</div>")
            this.state={}
            this.initMenu()
        },
        //添加功能
        initMenu:function(){
            var prev=null,
                the=this;
            //答案点击事件
            $(".listen .module li",the.context).each(function(i){
                $(this).on("click",function(){
                    prev&&prev.removeClass("on");
                    prev=$(this).addClass("on");
                    the.state.select=i;
                    the.next();
                })
            })
            var oVideo=$("#audio",the.context)[0]
            $(".listen .titleimg",the.context).on("click",function(){
                oVideo.play();
            })
        },
        //下一页
        next:function(){
            var the = this;
            clearInterval(this.timer); //消除上一次定时器
            this.timer=setTimeout(function(){
                the.showAnswer(true);//显示答案，只能点击一次
                the.getParent().next();//跳转下一页
            },1000);
        },
        //播放音频
        play:function(){
            var oVideo=$("#audio",this.context)[0]
            oVideo.play()
        },
        //移除事件
        disable:function(){
            $(".listen .module li",this.context).each(function(i){
                $(this).off()
            })
        },
        //显示答案
        showAnswer:function(disable){
            disable&&this.disable();
            var the=this;
            for(var i=0;i<this.data.options.length;i++){
                if(this.data.options[i].isRight){
                    if(i==this.state.select){
                        $(".module li",the.context).eq(this.state.select).addClass("ok")
                    }else{
                        $(".module li",the.context).eq(i).addClass("ok")
                        $(".module li",the.context).eq(this.state.select).addClass("error")
                    }
                }
            }
        }

    })
    cc.Listen.create=function(data,tpl){
        var sprite=new cc.Listen
        sprite.init(data,tpl)
        return sprite
    }

});
