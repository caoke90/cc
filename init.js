
//var loginUrl="http://login.koolearn.cn"
var loginUrl="http://login.koo.cn"
var weixinUrl="http://weixin.koo.cn"
if(location.hostname.indexOf("neibu")>-1){
    loginUrl="http://login.neibu.koo.cn"
    weixinUrl="http://weixin.neibu.koo.cn"
}
if(location.hostname.indexOf("release")>-1){
    loginUrl="http://login.release.koo.cn"
    weixinUrl="http://weixin.release.koo.cn"
}
if(location.hostname.indexOf("test")>-1){
    loginUrl="http://login.test.koo.cn"
    weixinUrl="http://weixin.test.koo.cn"
}
seajs.config({
    debug: 0,
    preload: ["cc","seajs-text.js","ejs.min.js","async.js"],
    // 文件编码
    charset: 'utf-8',

    //清除缓存
    map: [
            [ /^(.*\.(?:[a-z]+))(?:.*)$/i, '$1?'+ Math.random() ]
    ]
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}