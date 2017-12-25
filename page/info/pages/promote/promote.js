var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0
    },

    isSelf:        true,
    nickname:      "我",
    phone:         "",
    promoter:      {},

    promoters:     [],
    promoterTotal: 0
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
    App.addUserInfoResponder( this.onUserInfoCallback.bind( this ) );

    this.setData({
      isSelf:   options.nickname ? false : true,
      nickname: options.nickname ? options.nickname : "我",
      phone:    options.phone
    })

    this.requestData()
  },

  requestData: function () {
    var that = this;
    var App = getApp()

    wx.request({
      url: config.api.fetchUserInfo,
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
          var userInfo = JSON.parse(res.data.data)
          that.setData({
            userInfo: userInfo
          })
          fetchPromoterInfo()
        } else {
          App.handleError(res)
        }
      }
    })

    function fetchPromoterInfo() {
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
            fetchPromotersInfo()
          } else {
            App.handleError(res)
          }
        }
      });
    }

    function fetchPromotersInfo() {
      wx.request({
        url: config.api.fetchPromotersInfo,
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
    }
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.nickname + '的推广',
    })
  }
})