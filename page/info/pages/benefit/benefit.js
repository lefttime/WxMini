var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    userDetail: {},
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
    getApp().addUserInfoResponder( this.onUserInfoCallback.bind( this ) );
  },

  onShow: function() {
    var userDetail = wx.getStorageSync( "info.userDetail" )
    if (!!userDetail) {
      this.setData({
        userDetail: userDetail
      })
    }
  }
})