var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0
    },

    members: [],
    membersTotal: 0
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
          fetchMembersInfo()
        } else {
          App.handleError(res)
        }
      }
    })

    function fetchMembersInfo() {
      wx.request({
        url: config.api.fetchMembersByPromoterPhone,
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
            var members = JSON.parse(res.data.data)
            that.setData({
              members: members,
              membersTotal: members.length
            })
          } else {
            App.handleError(res)
          }
        }
      });
    }
  }
})