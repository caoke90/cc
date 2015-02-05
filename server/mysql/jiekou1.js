
/*功能点：
 0 创建数据库、表
    数据表xs_lists

 1 创建新的小说
     xs_name xs_summary =>xs_lists
     =>insertId
     =>xs+(xs_lists.insertId)
     数据表 xs_lists AND xs+(xs_lists.id)

 2 删除一部小说
     id=>xs_lists=>xs+(xs_lists.id)
     数据表 xs_lists AND xs+(xs_lists.id)

 3 修改小说
    id xs_name xs_summary =>xs_lists
    数据表 xs_lists

 4 查询所有小说
     xs_lists=>id xs_name xs_summary time
     数据表 xs_lists

 1 添加章节
     id=> xs+(xs_lists.id)
     xs+(xs_lists.id)<=title info
     数据表 xs+(xs_lists.id)

 2 删除章节
     id=> xs+(xs_lists.id)
     数据表 xs+(xs_lists.id)

 3 修改章节
     id title info=> xs+(xs_lists.id)
     数据表 xs+(xs_lists.id)

 4 查询小说目录
     xs+(xs_lists.id)=> id title info time
     数据表 xs+(xs_lists.id)
*/
var scene = cc.Snode.extend({
    //=> url=/api:path:type
    req:null,
    res:null,
    lists_sql0:{
        type: 'create-table'
        , table: "xs_lists"
        , ifNotExists: true
        , definition: {
            id: {
                type: 'serial'
                , primaryKey: true
            },
            //小说名
            xs_name:{
                type: 'text'
            },
            //小说介绍
            xs_summary:{
                type: 'text'
            }
            , time: {
                type: 'timestamp'
                , default: 'now()'
            }
        }
    },
    lists_sql1:{
        table:"xs_lists",
        type:"insert",
        values:{
            xs_name:"默认小说名字",
            xs_summary:"默认小说介绍"
        }
    },
    lists_sql2:{
        table:"xs_lists",
        type:"delete",
        where: {
            id: 0
        }
    },
    lists_sql3:{
        table:"xs_lists",
        type:"update",
        where: {
            id: 0
        }
        , updates: {
            xs_name: '默认小说名字修改'
            , xs_summary: '默认小说介绍修改'
        }
    },
    lists_sql4:{
        table:"xs_lists",
        type:"select",
        where: {
        }
    },
    xs_sql0:{
        type: 'create-table'
        , table: ""
        , ifNotExists: true
        , definition: {
            id: {
                type: 'int'
            }

            , title: {
                type: 'text'
            }

            , info: {
                type: 'text'
            }

            , time: {
                type: 'timestamp'
                , default: 'now()'
            }
        }
    },
    xs_sql1:{
        table:"",
        type:"insert",
        values:{
            title:"默认章节",
            info:"默认内容"
        }
    },
    xs_sql2:{
        table:"",
        type:"delete",
        where: {
            id: 0
        }
    },
    xs_sql3:{
        table:"",
        type:"update",
        where: {
            id: 0
        }
        , updates: {
            title: '默认章节修改'
            , info: '默认内容修改'
        }
    },
    xs_sql4:{
        table:"",
        type:"select",
        where: {
        }
    },
    //增加一本小说
    query_lists_sql1:function(xs_name,xs_summary){
        var the=this
        the.lists_sql1.values.xs_name=xs_name
        the.lists_sql1.values.xs_summary=xs_summary
        this.tasks.push(function(callback) {
            the.query(the.lists_sql1)(function(err,data){
                the.xs_sql0.table="xs"+data.insertId
                callback(err)
            })
        })

        this.tasks.push(the.query(the.xs_sql0))

        this.callback=function (err, result) {
            if(err){
                the.res.jsonp({
                    code:4,
                    msg:xs_name+"创建失败"
                })
            }else{
                the.res.jsonp({
                    code:0,
                    msg:xs_name+"创建成功"
                })
            }

        };
    },
    //删除一本小说
    query_lists_sql2:function(id){
        var the=this
        the.lists_sql2.where.id=id
        this.tasks.push(function(callback){
            async.parallel([
                the.query(the.lists_sql2),
                the.query({
                    type: 'drop-table',
                    table:"xs"+the.lists_sql2.where.id
                })
            ],callback)
        })

        this.callback=function (err, result) {
            if(err){
                the.res.jsonp({
                    code:404,
                    msg:"小说不存在或者重复删除"
                })
            }else{
                the.res.jsonp({
                    code:0,
                    msg:id+"删除成功"
                })
            }
        }

    },
    //修改小说名字 介绍
    query_lists_sql3:function(id,xs_name,xs_summary){
        var the=this
        the.lists_sql3.updates.xs_name=xs_name
        the.lists_sql3.updates.xs_summary=xs_summary
        the.lists_sql3.where.id=id
        this.tasks.push(function(callback) {
            the.query(the.lists_sql1)(function(err,data){
                the.xs_sql0.table="xs"+data.insertId
                callback(err)
            })
        })

        this.tasks.push(the.query(the.xs_sql0))

        this.callback=function (err, result) {
            if(err){
                the.res.jsonp({
                    code:4,
                    msg:xs_name+"创建失败"
                })
            }else{
                the.res.jsonp({
                    code:0,
                    msg:xs_name+"创建成功"
                })
            }

        };
    },
    //修改小说名字 介绍
    query_lists_sql4:function(model){
        var the=this
        the.lists_sql4=$.extend(the.lists_sql4,model)

        var len1=this.tasks.push(the.query(the.lists_sql4))

        this.callback=function (err, result) {
            if(err){
                the.res.jsonp({
                    code:4,
                    msg:"查询失败"
                })
            }else{
                the.res.jsonp({
                    code:0,
                    msg:"查询成功",
                    data:result[len1-1]
                })
            }

        };
    },
    query_lists_sql0:function(){
        var the=this

        this.tasks.push(the.query(the.lists_sql0))
        this.callback=function (err, result) {
            if(err){
                the.res.jsonp({
                    code:4,
                    msg:the.lists_sql0.table+"创建失败"
                })
            }else{
                the.res.jsonp({
                    code:0,
                    msg:the.lists_sql0.table+"数据库初始化成功"
                })
            }

        };
    },

    init: function(req, res) {
        this._super()


        this.res=res
        this.req=req

        this.test()
    },
    tasks:null,
    callback:null,
    test:function(){
        var the=this

        this.tasks=[]
        //连接数据库
        this.tasks.push(this.onEnter())
        //当前任务
        if(true){
            this.query_lists_sql4()
        }
        //关闭数据库
        this.tasks.push(this.onExit())
        async.series(this.tasks,this.callback=this.callback||function (err, result) {
            if(err){
                the.res.jsonp(err)
            }else{
                the.res.jsonp({
                    code:0,
                    msg:the.xs_sql0.table+"创建成功"
                })
            }

        });
    }


})
module.exports=function(req,res){
    var node=new scene()
    node.init(req,res)
    return node
};