var config = require("../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    userDetail: {
      id:        0,
      nickname:  "",
      phone:     "",
      post:      0,
      createdAt: "",
      updatedAt: "",
      avatarUrl: ''
    },

    promoter: {}
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
    var that = this
    var App = getApp()

    if (!App.globalData.uid || App.globalData.uid=="") {
      wx.redirectTo({
        url: '../proLogin/index',
      })
      return
    }

    App.addUserInfoResponder(this.onUserInfoCallback.bind(this));
    wx.request({
      url: config.api.fetchUserInfo,
      data: {
        phone: App.globalData.uid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var userDetail = JSON.parse(res.data.data)
          that.setData({
            userDetail: userDetail,
          })
          wx.setStorageSync("info.userDetail", userDetail)
          that.requestData();
        } else {
          App.handleError(res)
        }
      }
    });
  },
  
  requestData: function () {
    var that = this;
    var App = getApp()
    wx.request({
      url: config.api.fetchPromoterInfo,
      data: {
        phone: App.globalData.uid
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
  },

  logout: function (event) {
    var App = getApp()
    App.globalData.uid = ""
    wx.setStorageSync('global.userId', App.globalData.uid)
    wx.redirectTo({
      url: '../proLogin/index',
    })
  }
})