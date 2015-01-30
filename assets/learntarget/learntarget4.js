/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module){
    cc.log(location.href)
//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./learntarget4.html"),
        data:null,
        init:function(data,tpl){
            cc.log(window.localStorage.getItem("name"))
            this._super()
            if(!this._once&&(this._once=!this._once)){
                this.user={
                    userName:cc.localStorage("username")||"用户名"
                }
                this.getuser()
            }
            if(typeof this.user=="string"){
                this.user=JSON.parse(this.user)
            }
            //转化成数组
            this.data={
                user:this.user,
                url:location.href,
                stage:JSON.parse(cc.localStorage("stage"))||[],
                target:JSON.parse(cc.localStorage("target"))||[],
                interest:JSON.parse(cc.localStorage("interest"))||[]
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
        },
        //获取用户
        getuser:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/myinfo/getinfo",
                dataType : "jsonp",
                data:{
                    type:"jsonp",
                    "productId":getQueryString("productId")
                },
                success:function(data){
                    cc.log(data)
                    if(data.code==0){
                        cc.log("right")
                        if(data.content){
                            the.user=data.content
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
        //交互事件
        initAnimate:function(){
            var the=this
            //默认设置
            //保存
            $("#next a",the.context).on("click",function(){
                the.saveJsonp()
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
        //获取数据
        saveJsonp:function(){
            var the=this;
            var stage=""
            $(the.data.stage).each(function(k,v){
                stage+= v.taregrt_id+","+ v.name+";"
            })
            var target=""
            $(the.data.target).each(function(k,v){
                target+= v.id+","+ v.name+";"
            })
            var interest=""
            $(the.data.interest).each(function(k,v){
                interest+= v.id+","+ v.name+";"
            })
            var datatemp={
                type:"jsonp",
                stage:stage,
                target:target,
                interest:interest
            }
            $.ajax({
                url:weixinUrl+"/target/saveData",
                dataType : "jsonp",
                data:datatemp,
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        cc.localStorage("learntargetover","over")
                        location.href=$("#next a",the.context).attr("thehref")
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
    })

    module.exports=Scene
});
