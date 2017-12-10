$(".button-collapse").sideNav();

$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );

//get 10 items
var rpt = new Array(10); 
for(var i = 0; i < 10; ++i){
    rpt[i] = {
        building : "获取数据中",
        floor : "获取数据中" ,
        room: "获取数据中",
        repReason: "获取数据中",
        conPhone: "获取数据中",
        reportTime: "获取数据中",
        repFact:" "
    };
}

var items = new Array(10);

for(var i = 0; i < 10; ++i){
    items[i] = new Vue({
        el : "#repList" + i,
        data :{
            _id: "",
            id: i,
            seen:true,
            building: rpt[i].building,
            floor: rpt[i].floor,
            room: rpt[i].room,
            repReason: rpt[i].repReason,
            conPhone: rpt[i].conPhone,
            repStatus: null,
            reportTime: rpt[i].reportTime,
            repFact: rpt[i].repFact
        },
        methods : {
            deleteIt: function(event){
                
                axios.post('http://localhost:8889', JSON.stringify({cate:"DeleteOne",id:items[this.id]._id})).then(function(response){
                    if(response.data.status=="success"){
                        Materialize.toast('该条已被成功删除',4000);
                        
                    }else{
                        Materialize.toast('删除失败',4000);
                    }
                })

                refresh();
            },

            modalSubmit: function(event){
                var pos = {
                    cate: "modifyReport",
                    id: this._id,
                    building: Number(this.building),
                    floor: Number(this.floor),
                    room: Number(this.room),
                    repReason: this.repReason,
                    conPhone: this.conPhone,
                    repStatus: this.repStatus,
                    repFact: this.repFact
                }
                var chipdata = $('.chips').material_chip('data');
                pos.chipdata = new Array(chipdata.length);
                for(var i = 0; i < chipdata.length; ++i){
                    pos.chipdata[i] = chipdata[i].tag;
                }
                axios.post('http://localhost:8889', JSON.stringify(pos)).then(function(res){
                    if(res.data.status=="success"){
                        Materialize.toast('修改已成功提交',3000);
                    }else{
                        Materialize.toast('修改失败',3000);
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
            },
            dropdownNum: function(){
              return 'dropdown' + this.id;
            }
        }

    })
}

function refresh(){
    axios.post('http://localhost:8889',JSON.stringify({cate:"Getten"})).then(function(response){
        for(var i = 0; i < 10; ++i){
            items[i]._id = response.data[i]._id;
            if(response.data[i].building)items[i].building = response.data[i].building;
            if(response.data[i].floor)items[i].floor = response.data[i].floor;
            if(response.data[i].room)items[i].room = response.data[i].room;
            if(response.data[i].repReason)items[i].repReason = response.data[i].repReason;
            if(response.data[i].repFact)items[i].repFact = response.data[i].repFact;
            if(response.data[i].conPhone)items[i].conPhone = response.data[i].conPhone;
            if(response.data[i].reportTime)items[i].reportTime = (new Date(response.data[i].reportTime)).toLocaleDateString();
            items[i].repStatus = response.data[i].repStatus;
            if(response.data[i].chipdata){}
        }

    });
}
var refreshID = setInterval("refresh()","1000");

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    Materialize.updateTextFields();

    $('.modal').modal({
        ready: function(){
            clearInterval(refreshID);
        },
        complete: function(){
            refreshID = setInterval("refresh()","1000");
        }
    });
    $('select').material_select();
    $('.chips').material_chip();

    $('.chips-autocomplete').material_chip({
        autocompleteOptions: {
        data: {
            'Apple': null,
            'Microsoft': null,
            'Google': null
        },
        limit: Infinity,
        minLength: 1

        },
    });
    $('select').material_select();
    $('.collapsible').collapsible();

});

refresh();

