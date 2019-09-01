// miniprogram/pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    showToolBar: false,
    showIconRotate: false
  },
  getReceiver() {
    return new Promise( function(resolve,reject){
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'login'
      }).then(res => { // 成功
        resolve( res.result.openid)
      }).catch(res => {
        reject(res)
      })
    });
  },
  onShow: function(options) {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getUmbrellaList',
      data: {
        status: "todo"
      }
      // 传递给云函数的event参数
    }).then(res => { // 成功
      console.log(res);
      this.setData({
        arr: res.result.data
      })

    }).catch(err => { // 失败
      console.log(err)
    })
  },
  scroll: function(e) {
    // console.log(e)
  },
  onToggle: function() {
    this.setData({
      showToolBar: !this.data.showToolBar
    });
    this.iconToggleRotate();
  },
  onAdd: function() {
    // 判断有无权限
    wx.getUserInfo({
      // 用户已经授权
      success(e) {
        console.error('success', e)
        wx.navigateTo({
          url: '/pages/order/order'
        })
      },
      // 用户还没有授权
      fail(e) {
        // 提示尚未获取授权
        wx.showModal({
          title: '尚未授权',
          content: '请到个人页面手动授权',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // 自动跳转到个人页面去授权
              wx.navigateTo({
                url: '/pages/aboutMe/aboutMe',
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
        console.log('fail', e)
      }
    })
  },
  onPersonal: function() {
    wx.navigateTo({
      url: '/pages/aboutMe/aboutMe'
    })
  },
  iconToggleRotate: function() {
    this.setData({
      showIconRotate: !this.data.showIconRotate
    })
  },

  getOrder: function(event) {
    let that = this;
    // 判断有无权限
    wx.getUserInfo({
      // 用户已经授权
      success(e) {
        // 判断是否接单
        wx.showModal({
          title: '是否接单？',
          content: '点击确定接单',
          success(res) {
            if (res.confirm) {
              console.log('用户接单点击确定');
              let id = event.currentTarget.id;
              console.log("id--", id);
              // 获取openid
              let receiver;
              that.getReceiver().then(res =>{
                let receiver = res;
                console.log('接单：', receiver);
                // 确认接单 
                wx.cloud.callFunction({
                  name: 'changeStatus',
                  data: {
                    _id: id,
                    receiver: receiver,
                    status: "done" // 后续考虑多种状态
                  }
                }).then(res => { // 成功
                  wx.showToast({
                    title: '接单成功',
                    icon: 'success',
                    duration: 2000
                  });
                  // 自动跳转到个人页面去授权
                  wx.navigateTo({
                    url: '/pages/aboutMe/myGet/myGet',
                  })
                }).catch(err => { // 失败
                  console.log(err);
                })
              });
            } else if (res.cancel) {
              console.log('用户接单点击取消');
            }
          }
        })

        // 
        console.log('success', e)
      },
      // 用户还没有授权
      fail(e) {
        // 提示尚未获取授权
        wx.showModal({
          title: '尚未授权',
          content: '请到个人页面手动授权',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // 自动跳转到个人页面去授权
              wx.navigateTo({
                url: '/pages/aboutMe/aboutMe',
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
        console.log('fail', e)
      }
    })

  },

})