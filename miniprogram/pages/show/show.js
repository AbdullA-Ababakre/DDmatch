// miniprogram/pages/show/show.js
const app = getApp();

function fixZero(val) {
  if (val < 10) {
    val = '0' + val;
  }
  return val;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    showToolBar: false,
    showIconRotate: false,
    todayMonth: '',
    todayDate: '',
    flag: app.globalData.showOverlay
  },
  onLoad() {
    let now = new Date();
    let month = fixZero(now.getMonth() + 1);
    let date = fixZero(now.getDate());
    this.setData({
      todayMonth: month,
      todayDate: date
    });

    console.log("onload", app.globalData.showOverlay);
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
  onShow: function (options) {
    this.setData({
      flag: app.globalData.showOverlay
    });

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getUmbrellaList',
      data: {
        status: "todo"
      }
      // 传递给云函数的event参数   .start_time
    }).then(res => { // 成功
      let resArr = res.result.data;

      // 为了更好的展示时间
      for (let i = 0; i < resArr.length; i++) {
        let otherString = resArr[i].start_time.substring(8, resArr[i].start_time.length);
        // console.log(resArr[i].start_time.slice(0,8));
        // console.log('('+this.data.todayMonth+'-'+this.data.todayDate+'日)');
        if (resArr[i].start_time.slice(0, 8) === '(' + this.data.todayMonth + '-' + this.data.todayDate + '日)') {
          resArr[i].start_time = "(今天)" + otherString;
        }
      }

      this.setData({
        arr: resArr
      })
    }).catch(err => { // 失败
      console.log(err)
    })
  },
  scroll: function (e) {
    // console.log(e)
  },
  // 是否展开+ 
  onToggle: function () {
    this.setData({
      showToolBar: !this.data.showToolBar
    });
    this.iconToggleRotate();
  },
  onAdd: function () {
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

  onPersonal: function () {
    wx.navigateTo({
      url: '/pages/aboutMe/aboutMe'
    })
  },
  iconToggleRotate: function () {
    this.setData({
      showIconRotate: !this.data.showIconRotate
    })
  },


  getOrder: function (event) {
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
              that.getReceiver().then(res => {
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
  onBorrowReturn: function () {
    // 先确认是否进行授权
    wx.getUserInfo({
      // 用户已经授权
      success(e) {
        wx.navigateTo({
          url: '/pages/borrowReturn/borrowReturn',
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

  cancelShare: function () {
    console.log("helloC");
    app.globalData.showOverlay = false;
    this.setData({
      flag: app.globalData.showOverlay
    })
  },
  shureShare: function () {
    // share to other users
    // this.onShareAppMessage();
     
    

    app.globalData.showOverlay = false;
    this.setData({
      flag: app.globalData.showOverlay
    });
  },

  //  分享
   shareEvent:function(option, obj){
    //  console.log("option",option);
    //  console.log("obj",obj);
    let shareObj = {
      title: obj.title,
      path: obj.path,
      imgUrl: obj.imgUrl,
      success(res){
        // 转发成功之后的回调
  　　　 if (res.errMsg == 'shareAppMessage:ok') {}
      }, 
      fail(res){
         // 转发失败之后的回调
  　　　 if (res.errMsg == 'shareAppMessage:fail cancel') {
  　　　 // 用户取消转发
  　　　  } else if (res.errMsg == 'shareAppMessage:fail') {
  　　　  // 转发失败，其中 detail message 为详细失败信息
  　　　　}
      },
      complete(){
          // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    return shareObj;
  },
  onShareAppMessage: function(option){
   console.log("onload");
    let obj = {
      title: '快来跟我一起拼伞!!',
      path: 'pages/show/show',
      imageUrl: '/miniprogram/images/umbrellaLogo.jpeg'
    };
    return this.shareEvent(option, obj);
  }
});