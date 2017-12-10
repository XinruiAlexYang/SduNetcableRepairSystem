//get 10 items
var rpt = new Array(10); 
for(var i = 0; i < 10; ++i){
    rpt[i] = {
        building : "获取数据中",
        floor : "获取数据中" ,
        room: "获取数据中",
        repReason: "获取数据中",
        conPhone: "获取数据中",
        reportTime: "获取数据中"
    };
}

var items = new Array(10);

for(var i = 0; i < 10; ++i){
    items[i] = new Vue({
        el : "#repItem" + i,
        data :{
            id: i,
            seen:true,
            building: rpt[i].building,
            floor: rpt[i].floor,
            room: rpt[i].room,
            repReason: rpt[i].repReason,
            conPhone: rpt[i].conPhone,
            reportTime: rpt[i].reportTime
        },
        methods : {
            deleteIt: function(event){
                
                axios.post('http://localhost:8889', JSON.stringify({cate:"DeleteOne",id:items[this.id]._id})).then(function(response){
                    if(response.data.status=="success"){
                        var notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({ message: '该条已被成功删除'});
                        
                    }else{
                        var notification = document.querySelector('.mdl-js-snackbar');
                        notification.MaterialSnackbar.showSnackbar({ message: '删除失败'});
                    }
                })
            }
        },

        computed:{
            addressStr: function(){
                var str = ""+this.building + "-" + this.floor;
                if(this.room < 10)str += '0';
                str+= this.room;
                return str;
            }
        }

    })
}


axios.post('http://localhost:8889',JSON.stringify({cate:"Getten"})).then(function(response){
    for(var i = 0; i < 10; ++i){
        items[i]._id = response.data[i]._id;
        if(response.data[i].building)items[i].building = response.data[i].building;
        if(response.data[i].floor)items[i].floor = response.data[i].floor;
        if(response.data[i].room)items[i].room = response.data[i].room;
        if(response.data[i].repReason)items[i].repReason = response.data[i].repReason;
        if(response.data[i].conPhone)items[i].conPhone = response.data[i].conPhone;
        if(response.data[i].reportTime)items[i].reportTime = (new Date(response.data[i].reportTime)).toLocaleDateString();
        
    }

});
