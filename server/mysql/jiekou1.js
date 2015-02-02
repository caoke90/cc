var async = require("async");
var mysql  = require('mysql');

var scene = cc.Node.extend({
    //=> url=/api:path:type
    req:null,
    res:null,
    connection:null,
    init: function(req, res) {
        this.res=res
        this.req=req
        this._super()

        var the=this

        //mysql 数据库链接
        the.connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : ''
        });
        the.connection.query("USE test1")
        //获取多条数据

        the.update({id:1})(function(err, results) {
            cc.log(err)
            the.res.jsonp(results)
            the.connection.end();
        })
    },
    //增
    add:function(data,table,db){
        var the=this
        return function(callback){
            the.connection.query("INSERT INTO `xiaoshuo1` (`title`, `info`, `time`) VALUES ( '"+data.title+"', '"+data.info+"', '"+data.time+"')", function(err, rows, fields) {
                if (err) throw err;
                callback(null,rows)
            });
        }
    },
    //删除一条
    del:function(where,table,db){
        var the=this
        return function(callback){
            the.connection.query("DELETE FROM `xiaoshuo1` WHERE `id`="+id, function(err, rows, fields) {
                if (err) throw err;
                callback(null,rows)
            });
        }
    },
    //改
    update:function(where,data,table,db){
        var the=this
        return function(callback){
            the.connection.query("UPDATE `xiaoshuo1` SET `title` = 'caoke' WHERE `id`='"+data.id+"'", function(err, rows, fields) {
                if (err) throw err;
                callback(null,rows)
            });
        }
    },
    //查
    find:function(where){
        var the=this
        return function(callback){
            the.connection.query("SELECT * FROM `xiaoshuo1` WHERE `id`="+id, function(err, rows, fields) {
                if (err) throw err;
                callback(null,rows)
            });
        }
    },
    //返回一条数据
    getOne:function() {
        var the=this

        return function(callback){
            the.connection.query('SELECT * FROM `xiaoshuo1`', function(err, rows, fields) {
                if (err) throw err;
                callback(null,rows)
            });
        }

    },
    //获取多条数据
    getArr:function(){
        var the=this

        return function(callback){
            async.series([the.getOne(),the.getOne()],callback)
        }
    }
})
module.exports=function(req,res){
    var node=new scene()
    node.init(req,res)
    return node
};