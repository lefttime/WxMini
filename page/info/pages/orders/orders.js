var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    optionIndex:   0,
    selected_date: "2018-08",

    history: []
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
    wx.request({
      url: config.api.fetchPromoterInfo,
      data: {},
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var promoters = JSON.parse(res.data.data)
          App.globalData.promoterTotal = promoters.length
          that.setData({
            promoters: promoters,
            promoterTotal: promoters.length
          })
        } else {
          App.handleError(res)
        }
      }
    });
  },

  changeOption: function (event) {
    this.setData({
      optionIndex: event.target.id
    })
  },

  changeDate: function (event) {
    this.setData({
      selected_date: event.detail.value
    })
  }
})