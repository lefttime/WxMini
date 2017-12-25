var config = require("../../config.js");

const App = getApp()

Page({
  data: {
    logged: !1,

    phone: '',
    captcha: '',

    captcha_tips: '发送验证码',
    cdTimes: 0
  },

  sendCaptcha: function () {
    var App = getApp()
    var that = this
    if (that.data.phone.length != 11) {
      wx.showModal({
        title: '请求错误',
        content: '请入正确的手机号',
        showCancel: false,
      })
      return
    }

    wx.request({
      url: config.api.sendLoginCaptchaTo,
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
          App.handleError(res)
        }
      }
    });
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

  login() {
    var that = this;
    wx.request({
      url: config.api.myAppLogin,
      data: {
        phone: that.data.phone,
        captcha: that.data.captcha
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var resData = JSON.parse(res.data.data)
          App.globalData.uid = resData.phone
          wx.setStorageSync('global.userId', App.globalData.uid)
          wx.switchTab({
            url: '../info/index',
          })
        } else {
          wx.showModal({
            title: '请求错误',
            content: res.data.msg,
            showCancel: false,
          })
          App.handleError(res)
        }
      }
    });
  },

  cancel: function( event ) {
    wx.switchTab({
      url: '../home/index',
    })
  }
})