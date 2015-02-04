

var scene = cc.Snode.extend({
    //=> url=/api:path:type
    req:null,
    res:null,

    //添加一部新小说
    sql1:{
        table:"xs_lists",
        type:"insert",
        values:{
            xs_name:"小说名字",
            xs_summary:"小说介绍"
        }
    },
    //创建当前小说
    sql2:{
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

    //创建小说列表
    sql0:{
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

    init: function(req, res) {
        this._super()

        var the=this
        this.res=res
        this.req=req

        var tasks={}
        //onEnter
        tasks.start=(this.onEnter())
        //tasks
        //查询
//        tasks.t1=this.create_xs()
//        tasks.result=this.task1()
//        tasks.t2=this.create_xs_lists()
        tasks.t3=this.addXs(this.sql1)
        tasks.t1=this.create_xs()
        //onExit
        tasks.end=(this.onExit())
        async.series(
            tasks,
            function(err,data){

                if(err){
                    the.res.jsonp("fail")
                }else{
                    the.res.jsonp(data)
                }
            }
        )
    },
    //插入小说 name summary
    addXs:function(data1){
        var the=this
        return function(callback){
            the.query(data1)(function(err,data){
                the.sql2.table="xs"+data.insertId
                callback(err,data)
//                the.create_xs("xs"+data.insertId)(callback)
            })
        }

    },
    //查询数据
    task1:function(){
        return this.query({
            type: 'select'
            , table: this.data.table
        })
    },
    //创建数据表
    create_xs:function(name){
        return this.query(this.sql2)
    },
    create_xs_lists:function(){
        return this.query(this.sql0)
    }

})
module.exports=function(req,res){
    var node=new scene()
    node.init(req,res)
    return node
};