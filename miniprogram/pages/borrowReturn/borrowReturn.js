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
    borrowTime: "",
    returnTime: "",
    borrowName: '',
    borrowPhone: '',
    borrowCard: ''
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  bindBorrowLocationChange: function(e) {
    console.log('picker borrow place 发生选择改变，携带值为', e.detail.value);
    this.setData({
      borrowLocationIndex: e.detail.value
    })
  },
  bindReturnLocationChange: function(e) {
    console.log('picker return place 发生选择改变，携带值为', e.detail.value);
    this.setData({
      returnLocationIndex: e.detail.value
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getBorrowName: function(e) {
    let name = e.detail.value;
    this.setData({
      borrowName: name
    });
  },
  getBorrowPhone: function(e) {
    let phone = e.detail.value;
    this.setData({
      borrowPhone: phone
    });
  },
  getBorrowCard: function(e) {
    let card = e.detail.value;
    this.setData({
      borrowCard: card
    });

  },
  borrowUmbrella: function() {
    // validation
    if ((!this.data.borrowName) || (!this.data.borrowPhone) || (!this.data.borrowCard)) {
      wx.showToast({
        title: '请补充完成',
        icon: 'none'
      })
      return;
    }

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
  },
  returnUmbrella: function() {
    // validation
    if (!this.data.returnName || !his.data.returnPhone || !this.data.returnCard) {
      wx.showToast({
        title: '请补充完成',
        icon: 'none'
      })
      return;
    }

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
    // confirm return umbrella
  }

});