
define(function(require, exports, module){

    //接口处理
    var Api=cc.Class.extend({
        _url:"",
        _data:null,
        url:"",
        data:null,
        type:"jsonp",
        end:function(func){
            if(arguments.length>0){
                return this[this.type]()(func)
            }else{
                return this[this.type]()
            }

        },
        jsonp:function(){
            var the=this
            the.data.type="jsonp"
            return function(callback){
                $.ajax({
                    url:the.url,
                    data:the.data,
                    dataType : "jsonp",
                    success:function(data){
                        callback(null,data)
                    },
                    error:function(err){
                        the.alert(err)
                    }
                })
            }
        },
        get:function(){
            var the=this
            return function(callback){
                $.ajax({
                    url:the.url,
                    data:the.data,
                    type:"get",
                    dataType : "json",
                    success:function(data){
                        callback(null,data)
                    },
                    error:function(data){
                        the.alert(data)
                    }
                })
            }
        },
        post:function(){
            var the=this
            return function(callback){
                $.ajax({
                    url:the.url,
                    data:the.data,
                    type:"post",
                    dataType : "json",
                    success:function(data){
                        callback(null,data)
                    },
                    error:function(data){
                        the.alert(data)
                    }
                })
            }
        },
        //提示
        alert:function(msg){
            alert(msg)
        }
    })
    Api.after=function(json){
        var after={}
        for(var k in json){
            if(typeof json[k]=="function"){
                after[k]=function(){
                    return this._super.apply(this,arguments)||this
                }
            }
        }
        return after
    }
    Api.create=function(json){
        var temp=Api.extend(json).extend(Api.after(json))
        return new temp();
    }

    module.exports=Api.create

//    //demo
//    var api=module.exports
//    var d=api({
//        url:"http://weixin.neibu.koo.cn/target/getStages",
//        data:{},
//        query:function(){
//            this.data.q=1
//        }
//    }).query().end(function(err,data){
//            if(err){return;}
//            cc.log(data)
//        })

})
