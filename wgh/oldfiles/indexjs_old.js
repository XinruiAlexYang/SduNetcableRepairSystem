var form={
  state:{
    cate: "report",
    building: 0,
    floor: 0,
    room: 0,
    repReason: null,
    conPhone: null
  },
  setWhichBuilding(num){
    this.state.building = num;
  },
  setWhichFloor(num){
    this.state.floor = num;
  },
  setWhichRoom(num){
    this.state.room = num;
  }
};


var bu = new Array();
for(var i = 1; i <= 6; ++i){
  bu[i] = new Vue({
    el: '#bu' + i,
    data:{
      privateState:{
        isPress:false,
        id: i
      },
      shareState: form.state
      
    },
    computed:{
      isPress: function(){
        return this.shareState.building == this.privateState.id;
      },
    },
    methods: {
      chooseIt: function(event){
        if(this.shareState.building == this.privateState.id)form.setWhichBuilding(0);
        else form.setWhichBuilding(this.privateState.id);
      },
    },
  });
}

var fl = new Array();
for(var i = 1; i <= 7; ++i){
  fl[i] = new Vue({
    el: '#fl' + i,
    data:{
      privateState:{
        isPress:false,
        id: i
      },
      shareState: form.state
    },
    computed:{
      isPress: function(){
        return (this.shareState.floor == this.privateState.id);
      },
    },
    methods: {
      chooseIt: function(event){
        if(this.shareState.floor == this.privateState.id)form.setWhichFloor(0);
        else form.setWhichFloor(this.privateState.id);
      },
    },
  });
}

var ro = new Array();
for(var i = 1; i <= 36; ++i){
  ro[i] = new Vue({
    el: '#ro' + i,
    data:{
      privateState:{
        isPress:false,
        id: i
      },
      shareState: form.state
    },
    computed:{
      isPress: function(){
        return (this.shareState.room == this.privateState.id);
      },
    },
    methods: {
      chooseIt: function(event){
        if(this.shareState.room == this.privateState.id)form.setWhichRoom(0);
        else form.setWhichRoom(this.privateState.id);
      },
    },
  });
}

var reason = new Vue({
  el:'#repair-reason',
  data:{
    shareState : form.state
  }
});

var phone = new Vue({
  el: '#contact-phone',
  data:{
    shareState: form.state
  }
});

var errMsg = new Vue({
  el: '#errorMessage',
  data:{
    noBuilding: false,
    noFloor: false,
    noRoom: false,
    noRep: false,
    noPhone: false
  },

  methods:{
    checkMsg: function(event){
      this.noBuilding = this.noFloor = this.noRoom = this.noRep = this.noPhone = false;
      if(form.state.building == 0){this.noBuilding = true;return;}this.noBuilding = false;
      if(form.state.floor == 0){this.noFloor = true;return;}this.noFloor = false;
      if(form.state.room == 0){this.noRoom = true;return;}this.noRoom = false;
      if(!form.state.repReason){this.noRep = true;return;}this.noRep = false;
      if(!form.state.conPhone){this.noPhone = true; return;} this.noPhone = false;
      //transfer data to node
      axios.post('http://localhost:8889',JSON.stringify(form.state)).then(function(response){
        if(response.data.status=="success"){
          var notification = document.querySelector('.mdl-js-snackbar');
          notification.MaterialSnackbar.showSnackbar({ message: '您的维修报表已经提交'});
        }else{
          var notification = document.querySelector('.mdl-js-snackbar');
          notification.MaterialSnackbar.showSnackbar({ message: '报表未成功提交'});
        }
        
      }).catch(function(err){
        console.log(err);
      });
    },
  },
});

