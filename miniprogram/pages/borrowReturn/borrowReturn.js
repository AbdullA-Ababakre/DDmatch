const app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

function fixZero(val) {
  if (val < 10) {
    val = '0' + val;
  }
  return val;
}

Page({
  data: {
    tabs: ["借伞", "还伞"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    borrowLocations: ["文科楼h3(101)", "文科楼(101)", "教学楼D座(101)", "北图书馆前台", "南图书馆前台", "信工楼(101)"],
    borrowLocationIndex: 0,
    returnLocations: ["文科楼h3(101)", "文科楼(101)", "教学楼D座(101)", "北图书馆前台", "南图书馆前台", "信工楼(101)"],
    returnLocationIndex: 0,
    //  借伞
    borrowTime: "",
    borrowName: '',
    borrowPhone: '',
    borrowCard: '',
    borrowLocation: '',     //borrowLocations[borrowLocationIndex],   
    // 还伞
    returnTime: "",
    returnName: '',
    returnPhone: '',
    returnCard: '',
    returnLocation: '',     //returnLocations[returnLocationIndex]   //必须是还伞地点的第一个值
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    this.setData({
      borrowLocation: this.data.borrowLocations[this.data.borrowLocationIndex],
      returnLocation: this.data.returnLocations[this.data.returnLocationIndex]
    });
  },

  bindBorrowLocationChange: function (e) {
    this.setData({
      borrowLocationIndex: e.detail.value,
      borrowLocation: this.data.borrowLocations[e.detail.value]
    })

  },

  bindReturnLocationChange: function (e) {
    console.log('picker return place 发生选择改变，携带值为', e.detail.value);
    this.setData({
      returnLocationIndex: e.detail.value,
      returnLocation: this.data.returnLocations[e.detail.value]
    })

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getBorrowName: function (e) {
    let name = e.detail.value;
    this.setData({
      borrowName: name
    });
  },
  getBorrowPhone: function (e) {
    let phone = e.detail.value;
    this.setData({
      borrowPhone: phone
    });
  },
  getBorrowCard: function (e) {
    let card = e.detail.value;
    this.setData({
      borrowCard: card
    });

  },
  getReturnName: function (e) {
    let name = e.detail.value;
    this.setData({
      returnName: name
    });
  },
  getReturnPhone: function (e) {
    let phone = e.detail.value;
    this.setData({
      returnPhone: phone
    })
  },
  setBorrowTime: function () {
    // record the borrow time
    let time = new Date();
    let year = time.getFullYear();
    let month = fixZero(time.getMonth() + 1);
    let date = fixZero(time.getDate());
    let hour = fixZero(time.getHours());
    let min = fixZero(time.getMinutes());
    this.setData({
      borrowTime: year + '-' + month + '-' + date + '-' + hour + '-' + min
    })
  },
  getReturnCard: function (e) {
    let card = e.detail.value;
    this.setData({
      returnCard: card
    });
  },
  getReturnLocation: function (e) {
    let location = e.detail.value;
    this.setData({
      returnLocation: location
    });
  },
  async checkIsFirstBorrow() {
    // 要验证借过一次伞的人不能再借
    let borrowName = this.data.borrowName;
    let borrowCard = this.data.borrowCard;
    let borrowPhone = this.data.borrowPhone;

    let res = await wx.cloud.callFunction({
      // 要调用的函数
      name: 'borrowCheck',
      data: {
        borrowName: borrowName,
        borrowPhone: borrowPhone,
        borrowCard: borrowCard
      }
    });
    return res;
  },
  borrowUmbrella: function () {
    // validation
    if ((!this.data.borrowName) || (!this.data.borrowPhone) || (!this.data.borrowCard)) {
      wx.showToast({
        title: '请补充完成',
        icon: 'none'
      })
      return;
    }

    this.setBorrowTime();

    let borrowEdArr = [];
    let flag;
    let result = this.checkIsFirstBorrow();
    result.then(res => {
      borrowEdArr = res.result.data;
      
      if (borrowEdArr.length === 0) {
        // 向服务器提交数据
        this.getReceiver().then(res => {
          let openid = res;
          wx.cloud.callFunction({
            // 要调用的函数
            name: 'borrowumbrella',
            data: {
              user: openid,
              borrowTime: this.data.borrowTime,
              borrowName: this.data.borrowName,
              borrowPhone: this.data.borrowPhone,
              borrowCard: this.data.borrowCard,
              borrowLocation: this.data.borrowLocation
            }
          }).then(res => {
            // confirm the borrowed umbrella
            wx.showModal({
              title: '借伞成功',
              content: '请出示给工作人员,请24小时内归还',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.showToast({
                    title: '借伞成功'
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }).catch(err => {
            console.log(err);
          })
        })
      }else{
        wx.showToast({
          title:'你有没还的伞,不能借伞',
          icon:'none'
        })
      }
    });

  },

  setReturnTime: function () {
    // record the borrow time
    let time = new Date();
    let year = time.getFullYear();
    let month = fixZero(time.getMonth() + 1);
    let date = fixZero(time.getDate());
    let hour = fixZero(time.getHours());
    let min = fixZero(time.getMinutes());
    this.setData({
      returnTime: year + '-' + month + '-' + date + '-' + hour + '-' + min
    })
  },

  returnUmbrella: function () {
    // validation
    if ((!this.data.returnName) || (!this.data.returnPhone) || (!this.data.returnCard)) {
      wx.showToast({
        title: '请补充完成',
        icon: 'none'
      })
      return;
    }

    // set return time
    this.setReturnTime();

    let returnName = this.data.returnName;
    let returnPhone = this.data.returnPhone;
    let returnCard = this.data.returnCard;

    // 向服务器提交数据
    // 获取想要删的记录的_id
    this.getReceiver().then(res => {
      let openid = res;

      // 传还伞人的数据
      wx.cloud.callFunction({
        // 要调用的函数
        name: 'returnCheck',
        data: {
          returnName: returnName,
          returnPhone: returnPhone,
          returnCard: returnCard
        }
      }).then(res => {
        let arr = res.result.data;
        let id = arr[0]['_id'];
        //  删除记录  得传 _id
        wx.cloud.callFunction({
          // 要调用的函数
          name: 'returnUmbrella',
          data: {
            id: id
          },
        }).then(res => {
          console.log("delete--", res);
        });
      }).catch(err => {
        console.log(err);
      });

    });
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

});