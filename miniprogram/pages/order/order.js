const app = getApp()

function fixZero(val){
   if(val<10){
     val='0'+val;
   }
   return val;
}

Page({
  data: {
    time: "12:01",
    sexs: ["男", "女"],
    sexIndex: 0,
    start: '南图',
    end: "西南餐厅",
    links: ["手机号", "QQ号", "微信号"],
    linkIndex: 0,
    linkNumber: "",
    dec: "",
    textarea_curWordNum: 0,
    maxLength: 100
  },
  onLoad() {
    let now = new Date();
    let year=now.getFullYear();
    let month=fixZero(now.getMonth()+1);
    let date=fixZero(now.getDate());
    let hour =fixZero(now.getHours());
    let min = fixZero(now.getMinutes());
     
    this.setData({
      time:hour + ':' + min
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindSexChange: function(e) {
    console.log('picker sex 发生选择改变，携带值为', e.detail.value);
    this.setData({
      sexIndex: e.detail.value
    })
  },
  watchStart: function(event) {
    let place = event.detail.value;
    this.setData({
      start: place
    });
  },
  watchEnd: function(event) {
    let place = event.detail.value;
    this.setData({
      end: place
    });
  },
  watchLinkNumber: function(event) {
    let num = event.detail.value;
    this.setData({
      linkNumber: num
    });
  },
  bindLinkChange: function(e) {
    console.log('picker lins 发生选择改变，携带值为', e.detail.value);

    this.setData({
      linkIndex: e.detail.value
    })
  },
  // money
  textarea_inputs: function(e) {
    var value = e.detail.value;
    var len = parseInt(value.length);
    this.setData({
      textarea_curWordNum: len,
      dec: e.detail.value
    });
  },

  // 发布拼伞需求
  submitForm() {
    if ((!this.data.dec) || (!this.data.linkNumber)) {
      wx.showToast({
        title: '请你输入完整!!',
        icon: 'none'
      })
      return;
    }
    
    this.getReceiver().then(res => {
      let openid = res;
      
      let now = new Date();
      let year = now.getFullYear();
      let month = fixZero(now.getMonth() + 1);
      let date = fixZero(now.getDate());

      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'addUmbrella',
        // 传递给云函数的event参数
        data: {
          user: openid, // 用于区分用户
          start: this.data.start, // 起点
          end: this.data.end, // 终点
          link: '( ' + this.data.links[this.data.linkIndex] + ' ) ' + this.data.linkNumber, // 联系方式
          money: this.data.dec, // 报酬
          sex: this.data.sexs[this.data.sexIndex], // 性别
          start_time:'('+month+'-'+date+'日)' + this.data.time // 出发时间
        }
      }).then(res => { // 成功
        //console.log(res.result)
        
        app.globalData.showOverlay = true;   //改变全局变量
      
       
        // jump to the show page
        wx.navigateBack({
          url: '/pages/show/show'
        });

      }).catch(err => { // 失败
        console.log(err)
      })
    });
    
  },

  getReceiver() {
    return new Promise(function(resolve, reject) {
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'login'
      }).then(res => { // 成功
        resolve(res.result.openid)
      }).catch(res => {
        reject(res)
      })
    });
  },

});