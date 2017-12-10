var http = require('http'),
    querystring = require('querystring'),
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    Segment = require('segment');

var segment = new Segment();
segment.useDefault();
segment.loadDict('./dict/userdict.txt');
var ctime = 86400000;

var MongoURL = "mongodb://localhost:27017/wgh";

function testDateStr(str){
    return (str.indexOf('月')!= -1 && (str.indexOf('日')!= -1||str.indexOf('号') != -1));
}

function handleDateStr(str){
    var date = str.split('月');
    date[1] = (date[1].split('日'))[0];
    return [parseInt(date[0],10),parseInt(date[1],10)];
}

function InsertObject(coll,object){
    MongoClient.connect(MongoURL, function(err, db){
        assert.equal(null, err);
        console.log("Connect successfully to server");
        db.collection(coll, function(err, collection){
            collection.insertOne(object, function(err, result){
                assert.equal(null, err);
                console.log("Inserted 1 documents into the collection");
                db.close();
            });
        });
    });
}

function convert(result, callback){
    var pos = {};
    console.log(result);
    result.forEach(function(item){
        if(item === '未处理')pos.repStatus = {$ne:"success"};
        if(item === '已处理')pos.repStatus = "success";
        if(item === '一楼'||item === '一层')pos.floor = 1;
        if(item === '一楼'||item === '一层')pos.floor = 1;
        if(item === '二楼'||item === '二层')pos.floor = 2;
        if(item === '三楼'||item === '三层')pos.floor = 3;
        if(item === '四楼'||item === '四层')pos.floor = 4;
        if(item === '五楼'||item === '五层')pos.floor = 5;
        if(item === '六楼'||item === '六层')pos.floor = 6;
        if(item === '七楼'||item === '七层')pos.floor = 7;

        if(item === '一楼以上' || item === '一层以上')pos.floor = {$gte: 1};
        if(item === '二楼以上' || item === '二层以上')pos.floor = {$gte: 2};
        if(item === '三楼以上' || item === '三层以上')pos.floor = {$gte: 3};
        if(item === '四楼以上' || item === '四层以上')pos.floor = {$gte: 4};
        if(item === '五楼以上' || item === '五层以上')pos.floor = {$gte: 5};
        if(item === '六楼以上' || item === '六层以上')pos.floor = {$gte: 6};
        if(item === '七楼以上' || item === '七层以上')pos.floor = {$gte: 7};

        if(item === '一楼以下' || item === '一层以下')pos.floor = {$lte: 1};
        if(item === '二楼以下' || item === '二层以下')pos.floor = {$lte: 2};
        if(item === '三楼以下' || item === '三层以下')pos.floor = {$lte: 3};
        if(item === '四楼以下' || item === '四层以下')pos.floor = {$lte: 4};
        if(item === '五楼以下' || item === '五层以下')pos.floor = {$lte: 5};
        if(item === '六楼以下' || item === '六层以下')pos.floor = {$lte: 6};
        if(item === '七楼以下' || item === '七层以下')pos.floor = {$lte: 7};

        if(item === '一楼之上' || item === '一层之上')pos.floor = {$gt: 1};
        if(item === '二楼之上' || item === '二层之上')pos.floor = {$gt: 2};
        if(item === '三楼之上' || item === '三层之上')pos.floor = {$gt: 3};
        if(item === '四楼之上' || item === '四层之上')pos.floor = {$gt: 4};
        if(item === '五楼之上' || item === '五层之上')pos.floor = {$gt: 5};
        if(item === '六楼之上' || item === '六层之上')pos.floor = {$gt: 6};


        if(item === '二楼之下' || item === '二层之下')pos.floor = {$lt: 2};
        if(item === '三楼之下' || item === '三层之下')pos.floor = {$lt: 3};
        if(item === '四楼之下' || item === '四层之下')pos.floor = {$lt: 4};
        if(item === '五楼之下' || item === '五层之下')pos.floor = {$lt: 5};
        if(item === '六楼之下' || item === '六层之下')pos.floor = {$lt: 6};
        if(item === '七楼之下' || item === '七层之下')pos.floor = {$lt: 7};

        if(item === '一号楼')pos.building = 1;
        if(item === '二号楼')pos.building = 2;
        if(item === '三号楼')pos.building = 3;
        if(item === '四号楼')pos.building = 4;
        if(item === '五号楼')pos.building = 5;
        if(item === '六号楼')pos.building = 6;

        if(item === '最近一周'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - ctime*7;
            pos.reportTime = {
                $gte:yesterday
            };
        }

        if(item === '最近两天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - 2*ctime;
            pos.reportTime = {
                $gte:yesterday,
            };
        }

        if(item === '最近三天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - 3*ctime;
            pos.reportTime = {
                $gte:yesterday,
            };
        }

        if(item === '今天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var tomorrow = today + ctime;
            pos.reportTime = {
                $gte:today,
                $lt:tomorrow
            };
        }

        if(item === '昨天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - ctime;
            pos.reportTime = {
                $gte:yesterday,
                $lt:today
            };
        }

        if(item === '前天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - ctime;
            pos.reportTime = {
                $gte:yesterday-ctime,
                $lt:today-ctime
            };
        }

        if(item === '大前天'){
            var d = new Date(Date.now());
            var today = parseInt(new Date(d.toDateString()) - 0,10);
            var yesterday = today - ctime;
            pos.reportTime = {
                $gte:yesterday-ctime*2,
                $lt:today-ctime*2
            };
        }

        if(item.length === 3 && !isNaN(parseInt(item,10))){
            pos.floor = parseInt(item[0],10);
            pos.room = parseInt(item.slice(1,3),10);
        }

        if(item.length === 11 && !isNaN(parseInt(item, 10))){
            pos.conPhone = item;
        }

        if(testDateStr(item)){
            var s = handleDateStr(item);
            var thatDay = parseInt(new Date('2017-' + s[0].toString() + '-' + s[1].toString())-0);
            pos.reportTime = {
                $gte: thatDay - ctime,
                $lt: thatDay
            }
        }


    })
    console.log(pos);
    callback(pos);
}



function getHead(result){
    var list = [];
    result.forEach(function(item){
        if(item.indexOf('层')!= -1 ||item.indexOf('楼')!= -1 || item.indexOf('宿舍')!= -1)list.push('doom');
        if(item.indexOf('处理')!= -1)list.push('repStatus');
        if(item.indexOf('最近三天') != -1||item.indexOf('最近两天') != -1||item.indexOf('最近一周') != -1||item.indexOf('今天') != -1||item.indexOf('前天') != -1||item.indexOf('昨天') != -1||item.indexOf('报修日期') != -1|| (item.indexOf('月')!= -1 && (item.indexOf('日')!=-1 || item.indexOf('号')!= -1))){list.push('reportTime');console.log(item);}
        if(item.indexOf('联系方式') != -1)list.push('conPhone');
        if(item.indexOf('实际原因') != -1)list.push('repFact');
        if(item.indexOf('报修表') != -1 ||item.indexOf('报修单') != -1 ||item.indexOf('维修单') != -1 || item.indexOf('报修情况') != -1||item.indexOf('维修情况') != -1)list.push('all');

    });
    console.log(list);
    return list;
}



function UpdateObject(coll, object, callback){
    MongoClient.connect(MongoURL, function(err, db){
        assert.equal(null, err);
        console.log("Connect successfully to server");
        db.collection(coll, function(err, collection){
            collection.updateOne({_id: new ObjectID(object.id)},{
                $set:{
                    building: object.building,
                    floor: object.floor,
                    room: object.room,
                    repReason: object.repReason,
                    conPhone: object.conPhone,
                    repStatus: object.repStatus,
                    repFact: object.repFact,
                    repairTime: object.repairTime,
                    chipdata: object.chipdata
                }
            }, function(err, result){
                db.close();
                if(!err){
                    callback(null, result);
                }else{
                    callback(err, 0);
                }
            });
        })
    })
}

function DeleteById(id, callback){
    MongoClient.connect(MongoURL, function(err, db){
        var collection = db.collection('report', function(err, collec){

            collec.deleteOne({_id:new ObjectID(id)}, function(err, result){
                db.close();
                if(!err){
                    callback(null,result);
                }else{
                    callback(err, 0);
                }
            })
        });       
    });
}

function Getten(callback){ 
    MongoClient.connect(MongoURL, function(err, db){
        var collection = db.collection('report');
        collection.find().sort({_id:-1}).limit(10).toArray(function(err, items){
            db.close();
            callback(err, items);
        });
    });
}

function GetAll(callback){ 
    MongoClient.connect(MongoURL, function(err, db){
        var collection = db.collection('report');
        collection.find().sort({_id:-1}).toArray(function(err, items){
            db.close();
            callback(err, items);
        });
    });
}

function onRequest(req, res){
    console.log("Resquest received.");
    var jsonData = "";
    req.on('data', function(chunk){
        jsonData += chunk;
    });
    req.on('end', function(){
        var reqObj = JSON.parse(jsonData);
        res.setHeader("Access-Control-Allow-Origin","*");
        if(reqObj.cate === "report"){
            delete reqObj.cate;
            reqObj.reportTime = Date.now();
            reqObj.repairTime = null;
            reqObj.repairman = null;
            console.log(reqObj);
            res.writeHead(200);
            res.end(JSON.stringify({status:"success"}));
            InsertObject("report", reqObj);
        } else if(reqObj.cate === "Getten"){
            Getten(function(err, items){
                if(!err){
                    res.writeHead(200);
                    res.end(JSON.stringify(items));
                }
            });
        } else if(reqObj.cate === "GetAll"){
            GetAll(function(err, items){
                if(!err){
                    res.writeHead(200);
                    res.end(JSON.stringify(items));
                }
            });
        } else if(reqObj.cate === "DeleteOne"){
            DeleteById(reqObj.id, function(err,result){
                if(!err && result.result.n === 1){
                    res.writeHead(200);
                    res.end(JSON.stringify({status:"success"}));
                }else{
                    res.writeHead(200);
                    res.end(JSON.stringify({status:"fail"}));
                }
            })
        } else if(reqObj.cate === "modifyReport"){
            reqObj.repairTime = Date.now();
            UpdateObject("report", reqObj, function(err, result){
                if(!err){
                    res.writeHead(200);
                    res.end(JSON.stringify({status:"success"}));
                }else{
                    res.writeHead(200);
                    res.end(JSON.stringify({status:"failed"}));
                }
            });
        } else if(reqObj.cate === "nquery"){
            var message = reqObj.mas;
            var result = segment.doSegment(message,{simple:true});
            var lists = getHead(result);
            MongoClient.connect(MongoURL,function(err, db){
                var collection = db.collection('report');
                convert(result, function(pos){
                    collection.find(pos).toArray(function(err, items){
                        db.close();
                        res.writeHead(200);
                        var poss = {};
                        poss.lists = lists;
                        poss.data = items;
                        res.end(JSON.stringify(poss));
                    });
                });
            });
        }
    });
}



http.createServer(onRequest).listen(8889);