// miniprogram/pages/aboutMe/myGet/myGet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   arr:[]
  },

  //  生命周期函数--监听页面显示

  onShow: function () {
    this.getReceiver().then(res => {
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'getMyUmbrellas',
        data: {
          user: "user", // 发布者：user or 接单者：receiver
          openid: res
        }
      }).then(res => { // 成功
        console.log("success", res.result.data);
        let data = res.result.data;
        this.setData({
          arr:data
        })
        console.log(data)
      }).catch(err => {
        console.log("fail", err);
      })
    })

  },
  getReceiver() {
    return new Promise(function (resolve, reject) {
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
})