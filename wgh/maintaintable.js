$(".button-collapse").sideNav();
var linn = ""

var tbb = new Vue({
    el:'#tbb',
    data:{
        line: linn
    }
})

axios.post('http://localhost:8889',JSON.stringify({cate:"GetAll"})).then(function(response){
        
        for(let i = 0; i < response.data.length; ++i){
            linn += '<tr><td>';
            linn += response.data[i].building;
            linn += '-';
            linn += response.data[i].floor + '' + (response.data[i].room<10?'0'+response.data[i].room:response.data[i].room) + '</td><td>';
            linn += response.data[i].conPhone+'</td><td>';
            linn += response.data[i].repReason+'</td><td>';
            linn += (new Date(response.data[i].reportTime)).toLocaleDateString() + '</td><td>';
            linn += (response.data[i].repStatus==="success"?'已处理':'未处理') + '</td><td>';
            linn +=(typeof(response.data[i].repFact)=="undefined"?'':response.data[i].repFact)+'</td></tr>';
        } 
});

function refresh(){
    $('#tbb').html(linn);
}
 $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
refresh();
setInterval("refresh()","1000");
