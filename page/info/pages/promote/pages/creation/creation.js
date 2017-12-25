var config = require("../../../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    nickname:    '',
    phone:       '',
    captcha:     '',

    captcha_tips: '发送验证码',
    cdTimes:      0
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
    getApp().addUserInfoResponder(this.onUserInfoCallback.bind(this));
  },

  sendCaptcha: function () {
    var that = this;
    var App = getApp()

    if (that.data.phone.length != 11) {
      wx.showModal({
        title: '请求错误',
        content: '请入正确的手机号',
        showCancel: false,
      })
      return
    }

    wx.request({
      url: config.api.sendCaptchaTo,
      data: {
        phone:       that.data.phone,
        masterPhone: App.globalData.uid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res) {
          if(!res.data.errNo) {
            that.setData({
              cdTimes: 60
            })
            clearInterval(that.interval)
            that.interval = setInterval(that.playCDTimes, 1000)
            that.playCDTimes()
          } else {
            wx.showModal({
              title: '请求错误',
              content: res.data.msg,
              showCancel: false,
            })
          }
        } else {
          App.handleError(res)
        }
      }
    });
  },

  registerPromoter: function () {
    var that = this
    var App = getApp()

    if( that.data.nickname=="" || that.data.phone.length != 11 || that.data.captcha.length != 6 ) {
      wx.showModal({
        title: '请求错误',
        content: '信息填写错误或不全',
        showCancel: false,
      })
      return
    }

    wx.request({
      url: config.api.registerPromoter,
      data: {
        nickname:    that.data.nickname,
        phone:       that.data.phone,
        captcha:     that.data.captcha,
        masterPhone: App.globalData.uid
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res) {
          if (!res.data.errNo) {
            wx.showModal({
              title: '请求成功',
              content: '添加推广员成功',
              showCancel: false,
            })
            that.refreshPages()
          } else {
            wx.showModal({
              title: '请求错误',
              content: res.data.msg,
              showCancel: false,
            })
          }
        } else {
          App.handleError(res)
        }
      }
    });
  },

  refreshPages: function() {
    var pages = getCurrentPages();
    var prevPage1 = pages[pages.length - 2];
    var prevPage2 = pages[pages.length - 3];
    prevPage1.requestData()
    prevPage2.requestData()
  },

  nicknameChanged: function (event) {
    this.setData({
      nickname: event.detail.value
    })
  },

  phoneChanged: function (event) {
    this.setData({
      phone: event.detail.value
    })
  },

  captchaChanged: function (event) {
    this.setData({
      captcha: event.detail.value
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