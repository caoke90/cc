/**
 * Created with JetBrains WebStorm.
 * http://192.168.103.112/webroot/bindlogin.html?next_page=http://www.baidu.com#
 */


define(function(require, exports, module){

//    require.async("http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css")
    //每个scene对应一个页面
    var Scene=cc.Div.extend({
        tpl:require("./bindlogin.html"),

        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data={
                url:location.href
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")
;
            require("dialog-min");
            require("ui-dialog.css");
           this.initAnimate()
        },
        //提交数据
        initAnimate:function(){
            var the=this;
            //提交
            $("#tijiao",the.context).on("click",function(){

                the.data.userName=$("#login-name",the.context).val()
                if(!the.data.userName){
                    the.showdialog1("用户名不能为空",$("#login-name",the.context)[0])
                    return;
                }
                the.data.password=$("#login-pass",the.context).val()
                if(!the.data.password){
                    the.showdialog1("密码不能为空",$("#login-pass",the.context)[0])
                    return;
                }
                the.data.next_page=getQueryString("next_page")||"learntarget.html?file=learntarget"
                if(!the.data.next_page){
                    the.showdialog2("next_page不能为空")
                    return;
                }
                $.ajax({
                    url:weixinUrl+"/login/bindLogin",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        userName:the.data.userName,
                        password:the.data.password,
                        next_page:the.data.next_page
                    },
                    success:function(data){
                        if(data.code==0){
                            cc.log("right")
                            the.setCookie(data.content.cookie)
                            location.href=data.content.redirectUrl
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
        //设置coolie
        setCookie:function(json){
            require("jquery.cookie");
            if(typeof json=="string"){
                json=JSON().parse(json)
            }
            for(var k in json){
                $.cookie(k,json[k], { expires:7,path: location.host.replace(/\w*/,"")});
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
