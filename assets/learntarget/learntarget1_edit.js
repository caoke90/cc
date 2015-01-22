/**
 * Created with JetBrains WebStorm.
 * User: liuzhao
 * Date: 13-10-30
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */
//学习阶段
//var userData={
//    userId:cc.localStorage("userId"),
//    stage:[{taregrt_id:"",name:""}],
//    interest:[{taregrt_id:"",name:""}],
//    target:[{taregrt_id:"",name:""}]
//}

define(function(require, exports, module){
    cc.log(location.href)

    var Scene=cc.Div.extend({
        tpl:require("./learntarget1_edit.html"),
        data:null,
        body:"body",
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data=data||{
                content:[]
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("dialog-min");
            require("ui-dialog.css");

            this.initAnimate()
            if(!data){
                //没有数据，重新渲染
                this.getJsonp()
            }
        },
        //交互事件
        initAnimate:function(){
            var the=this
            //固定导航条
            require("stickUp.js")
            $('.stickup',the.context).stickUp();

            $(".list1 a",the.context).each(function(){
                $(this).on("click",function(e){
                    cc.localStorage("target","[]")
                    var arr=JSON.parse(cc.localStorage("stage"))||[]
                    arr[0]={
                        taregrt_id:$(this).attr("taregrt_id"),
                        name:$(this).text()
                    }
                    cc.localStorage("stage",JSON.stringify(arr))
                    cc.log(arr)
                })
            })

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
        //正确错误
        showdialog3:function(right,dom){
            if(right){
                $(".fui-check-circle",$(dom).parent()).show()
                $(".fui-cross-circle",$(dom).parent()).hide()
            }else{
                $(".fui-check-circle",$(dom).parent()).hide()
                $(".fui-cross-circle",$(dom).parent()).show()
            }
        },
        //重新渲染页面
        renderData:function(data){
            var parent= this.getParent()
            this.removeFromParent()
            var sprite=new Scene()
            sprite.body=this.body
            sprite.init(data)
            parent.addChild(sprite)
        },
        //获取数据
        getJsonp:function(){
            var the=this;
            $.ajax({
                url:weixinUrl+"/target/getStages",
                dataType : "jsonp",
                data:{
                    type:"jsonp"
                },
                success:function(data){
                    if(data.code==0){
                        cc.log("right")
                        the.renderData(data)
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
