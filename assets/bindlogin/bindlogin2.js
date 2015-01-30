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
        tpl:require("./bindlogin2.html"),
        data:null,
        init:function(data,tpl){
            this._super()
            //转化成数组
            this.data={
                url:location.href
            }
            this.tpl=tpl||this.tpl
            this.context=$("<div>"+ejs.render(this.tpl,this.data)+"</div>")
            require("dialog-min");
            require("ui-dialog.css");
            this.initAnimate()
        },
        //交互事件
        initAnimate:function(){
            var the=this
            //手机号
            the.telephoneCheck=false;
            $("#login-telephone",the.context).on("blur",function(){
                the.telephoneCheck=false;
                var telePhone=this.value
                var dom=this
                if(!(/^1[3|4|5|8]\d{9}$/.test(telePhone))){
//                    the.showdialog1("手机号码不正确，请重新输入",this)
                    the.showdialog3(the.telephoneCheck,dom)
                    return;
                }else{
                    the.telephoneCheck=true;
                    the.showdialog3(the.telephoneCheck,dom)
                }
            })
            //验证注册码
            the.codeCheck=false
            $("#login-code",this.context).on("blur",function(){
                the.codeCheck=false
                var dom=this
                if(dom.value.length==6){
                    $.ajax({
                        url:weixinUrl+"/fpwd/verifyCode",
                        dataType : "jsonp",
                        data:{
                            type:"jsonp",
                            "mobile":$("#login-telephone",the.context).val(),
                            "vcode":$(dom).val()
                        },
                        success:function(data){
                            if(data.code==0){
                                the.codeCheck=true;
                            }else{
                                the.codeCheck=false;
                                the.showdialog2("验证码错误"+data.msg);
                            }
                            the.showdialog3(the.codeCheck,dom)
                        },
                        error:function(){
                            the.showdialog2("验证超时失败")
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
                if(!the.telephoneCheck){
                    return
                }
                var dom=this
                $.ajax({
                    url:weixinUrl+"/fpwd/sendMobileCode",
                    dataType : "jsonp",
                    data:{
                        type:"jsonp",
                        "mobile":$("#login-telephone",the.context).val()
                    },
                    success:function(data){
                        if(data.code==0){
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

            //密码
            the.passCheck=false
            $("#login-pass",the.context).on("blur",function(){
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
            the.passCheck2=false;
            $("#login-pass2",this.context).on("blur",function(e){
                the.passCheck2=false
                if($(this).val()==""){
                    return;
                }
                if( $("#login-pass2",this.context).val()==$("#login-pass",the.context).val()){
                    the.passCheck2=true;
                    the.showdialog3(the.passCheck2,this)
                }else{
                    the.passCheck2=false;
                    the.showdialog1("密码不一致,请确认",this)
                    the.showdialog3(the.passCheck2,this)
                }
            })
            //提交
            $("#change",the.context).on("click",function(){
                if(the.telephoneCheck&&the.passCheck2&&the.codeCheck){
                    $.ajax({
                        url:weixinUrl+"/fpwd/findPwd",
                        dataType : "jsonp",
                        data:{
                            type:"jsonp",
                            "mobile":$("#login-telephone",the.context).val(),
                            "vcode":$("#login-code",the.context).val(),
                            "newPwd":$("#login-pass2",the.context).val()
                        },
                        success:function(data){
                            if(data.code==0){
                                the.showdialog2('密码修改成功！')
                            }else{
                                the.showdialog2(data.msg)
                            }

                        },
                        error:function(){
                            the.showdialog2("验证超时")
                        }
                    })
                }

            })
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
