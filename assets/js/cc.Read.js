/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module){

    cc.Read=cc.Div.extend({
        tpl:require("./cc.read.tpl"),
        //这里不能赋值对象或者数组
        state:null,
        data:null,
        pageArr:null,
        init:function(data,tpl){
            this._super()
            this.data=data
            this.context=$("<div>"+ejs.render(tpl||this.tpl,this.data)+"</div>")
            this.initAudio()
        },
        //音频
        initAudio:function(){
            var the=this

            var oVideo=$("#audio",the.context)[0]

            //当加载完//获取整个视频的长度
            oVideo.addEventListener("loadeddata",function(){
//               cc.log(this.duration)
                //开始播放
//                this.play()
            },false);
            //开始播放
            oVideo.addEventListener("play",function(){
                $(".audio_play",the.context).hide()
                $(".audio_pause",the.context).show()
                //当视频播放的时候显示进度条的位置。
                the._length=$("body").width()-$(".left",the.context).width()
            },false);
            oVideo.addEventListener("pause",function(){
                $(".audio_play",the.context).show()
                $(".audio_pause",the.context).hide()
            },false);
            var the=this
            oVideo.addEventListener("timeupdate",function(){
                //进度条变化
                this.currentTime==this.duration?$(".progress",the.context).width(0):$(".progress",the.context).width((this.currentTime/this.duration)*the._length);
                //时间变化
                var minu1=0|(this.currentTime/60)
                if(minu1<10){
                    minu1="0"+minu1
                }
                var sec1=0|this.currentTime%60
                if(sec1<10){
                    sec1="0"+sec1
                }
                var minu2=0|(this.duration/60)
                if(minu2<10){
                    minu2="0"+minu2
                }
                var sec2=0|this.duration%60
                if(sec2<10){
                    sec2="0"+sec2
                }
                $(".time",the.context).text(minu1+":"+sec1+"/"+minu2+":"+sec2)

            },false);
            //播放按钮
            $(".audio_play",the.context).on("click",function(){
                oVideo.play()
            })
            //暂停按钮
            $(".audio_pause",the.context).on("click",function(){
                oVideo.pause()
            })
        },
        pauseVideo : function(){
            var the = this,
                oVideo=$("#audio",the.context)[0];
            oVideo.pause();
        }
    })
    cc.Read.create=function(data,tpl){
        var sprite=new cc.Read
        sprite.init(data,tpl)
        return sprite
    }

});
