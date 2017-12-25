var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    charges:   [],
    date:      '当日',
    timestamp: 0
  },

  onUserInfoCallback(userInfo) {
    if (!userInfo) {
      return
    }
    this.setData({
      userInfo: userInfo
    })
  },

  onLoad: function (options) {
    var App = getApp()
    App.addUserInfoResponder(this.onUserInfoCallback.bind(this));

    var that = this;
    that.setData({
      date:      options.date,
      timestamp: options.timestamp
    })

    // wx.request({
    //   url: config.api.fetchChargesOfDays,
    //   data: {
    //     phone: App.globalData.uid,
    //     days: 5
    //   },
    //   header: {
    //     'content-type': 'application/json',
    //     'Cookie': "sid=" + App.globalData.sid
    //   },
    //   method: "POST",
    //   success: function (res) {
    //     if (res && !res.data.errNo) {
    //       var charges = JSON.parse(res.data.data)
    //       that.setData({
    //         charges: charges,
    //       })
    //     } else {
    //       App.handleError(res)
    //     }
    //   }
    // });
  },

  checkCharge: function (event) {
    var info = this.data.charges[parseInt(event.currentTarget.id)]
    wx.navigateTo({
      url: '../player_bill/player_bill?date=' + info.date + '&timestamp=' + info.timestamp,
    })
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.date + '账单',
    })
  }
})