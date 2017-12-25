var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    realname: '',
    wechat:   '',
    gameId:   '',
    phone:    '',
    captcha:  ''
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

  sendCaptcha: function() {
    var that = this;
    var App = getApp()

    if (that.data.phone.length != 11) {
      wx.showModal({
        title:      '请求错误',
        content:    '输入手机号错误，请重新输入',
        showCancel: false,
      })
      return
    }

    wx.request({
      url: config.api.sendCaptchaTo,
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
          wx.showModal({
            title: '请求成功',
            content: '请及时查看手机信息',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '请求错误',
            content: '输入手机号错误，请重新输入',
            showCancel: false,
          })
          App.handleError(res)
        }
      }
    });
  },

  registerPromoter: function () {
    var that = this;
    var App = getApp()
    wx.request({
      url: config.api.registerPromoter,
      data: {
        realname: that.data.realname,
        wechat:   that.data.wechat,
        gameId:   parseInt(that.data.gameId),
        phone:    that.data.phone,
        captcha:  that.data.captcha,
        phone:    that.data.phone
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          wx.showModal({
            title: '请求成功',
            content: '添加推广员成功',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '请求失败',
            content: '添加推广员失败: ' + res.data.msg,
            showCancel: false,
          })
          App.handleError(res)
        }
      }
    });
  },

  realnameChanged: function( event ) {
    this.setData({
      realname: event.detail.value
    })
  },

  wechatChanged: function( event ) {
    this.setData({
      wechat: event.detail.value
    })
  },

  gameIdChanged: function( event ) {
    this.setData({
      gameId: event.detail.value
    })
  },

  phoneChanged: function( event ) {
    this.setData({
      phone: event.detail.value
    })
  },

  captchaChanged: function( event ) {
    this.setData({
      captcha: event.detail.value
    })
  }
})