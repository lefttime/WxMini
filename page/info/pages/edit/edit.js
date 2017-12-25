var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post:     0,
    },

    password: '',
    wechat:   '',
    gameID:   '',
    cdTimes: 0
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

    this.setData({
      phone: App.globalData.uid
    })

    var that = this
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

  changePhoneNumber: function( event ) {
    wx.navigateTo({
      url: '../phone/phone',
    })
  },

  passwordChanged: function( event ) {
    this.setData({
      password: event.detail.value
    })
  },
  
  wechatChanged: function (event) {
    this.setData({
      wechat: event.detail.value
    })
  },

  gameIDChanged: function (event) {
    this.setData({
      gameID: event.detail.value
    })
  },

  playCDTimes: function () {
    var cdTimes = this.data.cdTimes - 1
    if (cdTimes <= 0) {
      clearInterval(this.interval)
      this.setData({
        cdTimes: cdTimes,
        captcha_tips: '发送验证码'
      })
    } else {
      this.setData({
        cdTimes: cdTimes,
        captcha_tips: cdTimes + '秒'
      })
    }
  }
})