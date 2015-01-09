
//var loginUrl="http://login.koolearn.cn"
var loginUrl="http://login.neibu.koo.cn"
var weixinUrl="http://weixin.neibu.koo.cn"
seajs.config({
    debug: 0,
    preload: ["cc","seajs-text.js","ejs.min.js"],
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