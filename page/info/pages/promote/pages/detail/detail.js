var config = require("../../../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    promoter: {
      avatar: ''
    },
    phone:    ""
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
    var App = getApp();
    App.addUserInfoResponder(this.onUserInfoCallback.bind(this));

    var that = this;
    that.data.phone = options.phone

    wx.request({
      url: config.api.fetchPromoterInfo,
      data: {
        phone: that.data.phone
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var promoter = JSON.parse(res.data.data)
          that.setData({
            promoter: promoter
          })
        } else {
          App.handleError(res)
        }
      }
    });
  }
})