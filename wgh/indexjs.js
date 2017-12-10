var form = new Vue({
    el: "#form",
    data:{
        whichBLight: 0,
        whichFLight: -1,
        whichDLight: 0,
        repReason: "",
        conPhone: ""
    },
    methods:{
        checked: function(){
            var ans = true;
            if(this.whichBLight === 0){
                Materialize.toast('请选择宿舍楼号',800); ans = false;
            }
            if(this.whichFLight === -1){
                Materialize.toast('请选择宿舍楼层',800); ans = false;
            }
            if(this.whichDLight == 0){
                Materialize.toast('请选择宿舍房间号',800); ans = false;
            }
            if(this.repReason == ""){
                Materialize.toast('请填写报修原因',800); ans = false;
            }
            if(this.conPhone == ""){
                Materialize.toast('请填写联系方式',800); ans = false;
            }
            return ans;
        },

        submit: function(event){
            if(this.checked()){
                var pos = {
                    cate: "report",
                    building: this.whichBLight,
                    floor: this.whichFLight,
                    room: this.whichDLight,
                    repReason: this.repReason,
                    conPhone: this.conPhone
                };
                axios.post('http://localhost:8889',JSON.stringify(pos)).then(function(res){
                    if(res.data.status=="success"){
                        Materialize.toast('您的维修报表已经提交',3000);
                    }else{
                        Materialize.toast('报表提交失败',3000 );
                    }
                }).catch(function(err){
                    Materialize.toast('报表提交失败-网络错误',3000 );
                })
            }
            
        },
    }
});
 $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    }
  );