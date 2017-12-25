var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    promoter:        {},
    isPromoterValid: false
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
  },

  searchConfirm: function( event ) {
    var that = this
    var App = getApp()
    if (event.detail.value=='') {
      wx.showModal({
        title:       '查找失败',
        content:     '搜索不能为空',
        showCancel:  false,
        confirmText: "确定"
      })
      this.setData({
        isPromoterValid: false
      })
      return
    }

    wx.request({
      url: config.api.searchUserInfo,
      data: { id: event.detail.value },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + getApp().globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var userInfo = JSON.parse(res.data.data)
          that.fetchPromoter( userInfo )
        } else {
          that.setData({
            isPromoterValid: false
          })
          wx.showModal({
            title:       '查找失败',
            content:     res.data.msg,
            showCancel:  false,
            confirmText: "确定"
          })
          App.handleError(  )
        }
      }
    });
  },

  fetchPromoter: function( userInfo ) {
    var that = this
    var App = getApp()
    wx.request({
      url: config.api.fetchPromoterInfo,
      data: {
        openId:  userInfo.openId,
        unionId: userInfo.unionId,
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var promoter = JSON.parse(res.data.data)
          if ( promoter.unionId.length > 0 ) {
            that.setData({
              promoter:        promoter,
              isPromoterValid: true
            })
          }
        } else {
          App.handleError(res)
        }
      }
    });
  },

  doFrozen: function() {
    var that = this
    var App = getApp()
    if (!that.data.isPromoterValid) {
      return
    }

    if (that.data.promoter.status) {
      wx.request({
        url: config.api.unFrozenPromoter,
        data: {
          promoterUnionId: that.data.promoter.unionId,
        },
        header: {
          'content-type': 'application/json',
          'Cookie': "sid=" + App.globalData.sid
        },
        method: "POST",
        success: function (res) {
          if (res && !res.data.errNo) {
            var promoter = that.data.promoter
            if (promoter.unionId.length > 0) {
              promoter.status = 0
              that.setData({
                promoter: promoter,
                isPromoterValid: true
              })
            }
          } else {
            App.handleError(res)
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '../frozen/frozen',
      })
    }
  }
})