var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    benefitInfo:  {},
    registerInfo: {},
    promoterInfo: {},
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
      url: config.api.fetchRegisterUserInfo,
      data: {},
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var registerInfo = JSON.parse(res.data.data)
          that.setData({
            registerInfo: registerInfo,
          })
        } else {
          App.handleError(res)
        }
      }
    });

    wx.request({
      url: config.api.fetchPromoterCount,
      data: {},
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var promoterInfo = JSON.parse(res.data.data)
          that.setData({
            promoterInfo: promoterInfo,
          })
        } else {
          App.handleError(res)
        }
      }
    });

    wx.request({
      url: config.api.fetchBenefitCount,
      data: {},
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var benefitInfo = JSON.parse(res.data.data)
          that.setData({
            benefitInfo: benefitInfo,
          })
        } else {
          App.handleError(res)
        }
      }
    });
  }
})