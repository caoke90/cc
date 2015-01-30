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
        tpl:require("./bindlogin1.html"),
        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data={
                url:location.href
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")

            require("jquery.cookie");
            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
        },
        //交互事件
        initAnimate:function(){
            var the=this
            //用户名
            the.nameCheck=false
            $("#login-name",this.context).on("blur",function(){
                var dom=this
                the.nameCheck=false
                if($(this).val()==""){
                    return;
                }
                var telePhone=this.value
                if(!(/^[A-Za-z\u4e00-\u9fa5][A-Za-z0-9\u4e00-\u9fa5_\\-]{1,15}$/.test(telePhone))){
                    the.showdialog1("2-16个字符或汉字组成",this)
                    the.showdialog3(the.nameCheck,dom)
                }else{
                    $.ajax({
                        url:"http://login.koolearn.com/sso/userNameExists.do",
                        type:"get",
                        dataType : "jsonp",
                        data:{
                            type:"jsonp",
                            userName:telePhone
                        },
                        success:function(data){
                            cc.log(data)
                            if(data=="true"){
                                the.showdialog1("该用户名已被使用",dom)
                            }else{
                                the.nameCheck=true
                            }
                            the.showdialog3(the.nameCheck,dom)

                        },
                        error:function(){
                            the.showdialog2("验证失败")
                        }
                    })
                }
            })
            //密码
            the.passCheck=false
            $("#login-pass",this.context).on("blur",function(){
                the.passCheck=false
                if($(this).val()==""){
                    return;
                }
                var dom=this
                var telePhone=this.value
                if(!(/^[\S]{6,16}$/.test(telePhone))){
                    the.showdialog1("6-16字符组成，区分大小写",this)
                    the.showdialog3(the.passCheck,dom)
                    return;
                }
                if(/[ ]+/.test(telePhone)){
                    the.showdialog1("密码不能含有空格",this)
                    the.showdialog3(the.passCheck,dom)
                    return;
                }
                the.passCheck=true;
                the.showdialog3(the.passCheck,dom)
            })
            //手机号
            the.telephoneCheck=false;
            $("#login-telephone",the.context).on("blur",function(){
                the.telephoneCheck=false;
                if($(this).val()==""){
                    return;
                }
                var telePhone=this.value
                var dom=this
                if(!(/^1[3|4|5|8]\d{9}$/.test(telePhone))){
                    the.telephoneCheck=false;
//                    the.showdialog1("手机号码不正确，请重新输入",this)
                    the.showdialog3(the.telephoneCheck,dom)
                    return;
                }else{
                    $.ajax({
                        url:loginUrl+"/sso/mobileExists.do",
                        dataType : "jsonp",
                        data:{
                            type:"jsonp",
                            mobile:telePhone
                        },
                        success:function(data){
                            if(data=="true"){
                                the.showdialog1("该手机号已注册",dom)
                                the.telephoneCheck=false;
                            }else{
                                the.telephoneCheck=true;
                            }
                            the.showdialog3(the.telephoneCheck,dom)

                        },
                        error:function(){
                            the.showdialog2("验证失败")
                        }
                    })
                }
            })
            //验证注册码
            the.codeCheck=false
            $("#login-code",this.context).on("blur",function(){
                the.codeCheck=false
                if($(this).val()==""){
                    return;
                }
                var dom=this
                if($(this).val().length==6){
                    $.ajax({
                        url:loginUrl+"/sso/verifyMobileCode.do",
                        dataType : "jsonp",
                        data:{
                            type:"jsonp",
                            "RANDOM_NUMBER_TITLE":dom.value,
                            "codeParam":"RANDOM_NUMBER_TITLE",
                            "mobile":$("#login-telephone",the.context).val()

                        },
                        success:function(data){
                            if (data == "success") {
                                the.codeCheck=true;
                            }else if(data == 'timeout') {
                                the.showdialog2(data.mes);
                                the.codeCheck=false;;
                            } else {
                                the.showdialog2(data.mes);
                                the.codeCheck=false;
                            }
                            the.showdialog3(the.codeCheck,dom)
                        },
                        error:function(){
                            the.showdialog2("验证失败")
                        }
                    })
                }

            }).on("input",function(){
                    if($(this).val().length==6){
                        $(this).trigger("blur")
                    }
                })
            //获取验证码
            $("#login-getcode",the.context).on("click",function(){
                var dom=this
                $.ajax({
                    url:loginUrl+"/sso/sendMobileMessage.do",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        "mobile":$("#login-telephone",the.context).val(),
                        "msgInterval":60
                    },
                    success:function(msg){
                        if(msg == 'success'){
                            the.showdialog2('<span style="display:inline-block;margin-bottom:5px;">验证码已发送</span><br><span style="display:inline-block;color:#ff6600;padding-left:24px">由于运营商原因，手机短信可能会有延迟，请耐心等待</span>')
                            $("#login-time",the.context).show();
                            the.cutTime(59)
                        }else if(msg == 'error.sendmsg.maxtimes'){
                            the.showdialog2("同一个手机号码一天只可接收三次手机验证码")
                        }else if(msg == 'error.verifycode.wrong'){
                            the.showdialog2("验证码有误")
                        }else if(msg == 'three'){
                            the.showdialog2("请于上次获取验证码一分钟之后再获取")
                        }else{
                            the.showdialog2("短信验证码发送失败，请重新获取")
                        }

                    },
                    error:function(){
                        the.showdialog2("验证失败")
                    }
                })
            })
            the.agreeCheck=true;
            $("#login-agree",the.context).on("click",function(){
                if(the.agreeCheck){
                    $(this).removeClass("fui-checkbox-checked")
                }else{
                    $(this).addClass("fui-checkbox-checked")
                }
                the.agreeCheck=!the.agreeCheck
                cc.log(the.agreeCheck)

            })
            $("#login-reg",the.context).on("click",function(){
                if(!the.nameCheck){
                    $("#login-name",this.context).trigger("blur")
                    return;
                }
                if(!the.passCheck){
                    $("#login-pass",this.context).trigger("blur")
                    return
                }
                if(!the.telephoneCheck){
                    $("#login-telephone",this.context).trigger("blur")
                    return;
                }
                if(!the.codeCheck){
                    $("#login-code",this.context).trigger("blur")
                    return;
                }
                if(!the.agreeCheck){
                    the.showdialog2("如需注册，请勾选同意本站的客户服务条款！")
                    return;
                }

                $.ajax({
                    url:weixinUrl+"/login/bindRegister",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        userName:$("#login-name",the.context).val(),
                        password:$("#login-pass",the.context).val(),
                        mobile:$("#login-telephone",the.context).val(),
                        verifyCode:$("#login-code",the.context).val(),
                        next_page:getQueryString("next_page")
                    },
                    success:function(data){
                        if(data.code==0){
                            the.setCookie(data.content.cookie)
                            location.href=data.content.redirectUrl
                        }else{
                            the.showdialog2("验证失败"+data.msg)
                        }
                    },
                    error:function(){
                        the.showdialog2("验证失败")
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
                $.cookie(k,json[k], { expires:7,domain: location.host.replace(/\w*/,""),path:"/"});
            }
        },
        //60秒重新发送
        cutTime:function(num){
            var the=this
            $("#login-time",the.context).text(num+"秒后重新发送")
            if(num>0&&$("#login-time",the.context).css("display")!="hide"){
                setTimeout(function(){
                    the.cutTime(num-1)
                },1000)
            }else{
                $("#login-getcode",this.context).show()
                $("#login-time",this.context).hide()
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
        //正确错误
        showdialog3:function(right,dom){
            if(right){
                $(".fui-check-circle",$(dom).parent()).show()
                $(".fui-cross-circle",$(dom).parent()).hide()
            }else{
                $(".fui-check-circle",$(dom).parent()).hide()
                $(".fui-cross-circle",$(dom).parent()).show()
            }
        }
    })

    module.exports=Scene
});
