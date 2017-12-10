$(".button-collapse").sideNav();
var rs = {};
var search = new Vue({
    el: '#search',
    data:{
        message:""
    },
    methods:{
        submit: function(event){
            var pose = {
                cate:"nquery",
                mas: this.message
            };
            axios.post('http://localhost:8889',JSON.stringify(pose)).then(function(response){
                rs = response.data;
                console.log(rs);
                var hhhh = '<table class="centered"><thead><tr>';
                if(rs.lists.indexOf('all')!= -1){
                    hhhh += '<th>宿舍号</th><th>联系方式</th><th>报修原因</th><th>报修日期</th><th>处理状态</th><th>实际原因</th></tr></thead>'
                }else{
                    if(rs.lists.indexOf('doom')!= -1)hhhh += '<th>宿舍号</th>';
                    if(rs.lists.indexOf('repStatus')!= -1)hhhh += '<th>处理状态</th>';
                    if(rs.lists.indexOf('reportTime')!= -1)hhhh += '<th>报修日期</th>';
                    if(rs.lists.indexOf('conPhone') != -1)hhhh += '<th>联系方式</th>';
                    if(rs.lists.indexOf('repFact') != -1)hhhh += '<th>实际原因</th>';
                    hhhh+='</tr></thead>';
                }
                hhhh += '<tbody>';
                for(var i = 0; i < rs.data.length; ++i){
                    hhhh+='<tr>';
                    if(rs.lists.indexOf('all')!= -1){
                        hhhh +='<tr><td>'+rs.data[i].building + '-'+rs.data[i].floor+''+(rs.data[i].room<10?'0'+rs.data[i].room:rs.data[i].room)+'</td><td>'+rs.data[i].conPhone+'</td><td>'+rs.data[i].repReason+'</td><td>'+(new Date(rs.data[i].reportTime)).toLocaleDateString()+'</td><td>'+(rs.data[i].repStatus==="success"?'已处理':'未处理')+'</td><td>'+(typeof(rs.data[i].repFact)=="undefined"?'':rs.data[i].repFact)+'</td>';
                    }else{
                        if(rs.lists.indexOf('doom')!= -1)hhhh += '<td>'+rs.data[i].building + '-'+rs.data[i].floor+''+(rs.data[i].room<10?'0'+rs.data[i].room:rs.data[i].room)+'</td>';
                        if(rs.lists.indexOf('repStatus')!= -1)hhhh += '<td>'+(rs.data[i].repStatus==="success"?'已处理':'未处理')+'</td>';
                        if(rs.lists.indexOf('reportTime')!= -1)hhhh += '<td>'+(new Date(rs.data[i].reportTime)).toLocaleDateString()+'</td>';
                        if(rs.lists.indexOf('conPhone') != -1)hhhh += '<td>'+rs.data[i].conPhone+'</td>';
                        if(rs.lists.indexOf('repFact') != -1)hhhh += '<td>'+(typeof(rs.data[i].repFact)=="undefined"?'':rs.data[i].repFact)+'</td>';
                    }
                    
                    hhhh += '</tr>';
                }

                hhhh+= '</tbody></table>';
                $("#tables").html(hhhh);
                Materialize.toast('查询成功，共计'+rs.data.length+'条数据', 10000);
            });
        },
    }
})
 $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });