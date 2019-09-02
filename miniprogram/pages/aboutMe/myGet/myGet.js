// miniprogram/pages/aboutMe/myGet/myGet.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arr: []
  },
  //  生命周期函数--监听页面显示
  onShow: function() {
    this.getReceiver().then(res => {
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'getMyUmbrellas',
        data: {
          user: "receiver", // 发布者：user or 接单者：receiver
          openid: res
        }
      }).then(res => { // 成功
        console.log("success", res.result.data);
        let data = res.result.data;
        this.setData({
          arr: data
        });

      }).catch(err => {
        console.log("fail", err);
      })
    })
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
  scroll: function(e) {
    // console.log(e)
  },

  copyTBL: function(e) {
    // 可以用regex来只显示具体联系方式 
    let copyData=e.target.dataset.name;
    console.log(copyData);
    var self = this;
    wx.setClipboardData({
      data: copyData,
      success: function(res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
          icon:'none'
        })
      }
    });
  }
})