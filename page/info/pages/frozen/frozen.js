var config = require("../../../../config.js");

Page({
  data: {
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },

    durations: [
      { value: 1,  name: '1天', checked: 'true' },
      { value: 2,  name: '2天' },
      { value: 5,  name: '5天' },
      { value: 15, name: '15天' },
      { value: 30, name: '1个月' },
    ]
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

  durationChange: function( event ) {
    var durations = this.data.durations
    for (var idx = 0; idx < durations.length; ++idx) {
      durations[idx].checked = (durations[idx].value==event.detail.value)
    }

    this.setData({
      durations: durations
    })
  },

  doFrozen: function() {
    var that = this
    var App = getApp()

    var duration = 0
    for (var idx = 0; idx < that.data.durations.length; ++idx) {
      if (that.data.durations[idx].checked) {
        duration = that.data.durations[idx].value
      }
    }

    var pages    = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.request({
      url: config.api.frozenPromoter,
      data: {
        duration:        duration,
        promoterUnionId: prevPage.data.promoter.unionId,
      },
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          var promoter = prevPage.data.promoter
          promoter.status = duration
          prevPage.setData({
            promoter: promoter
          })
          wx.navigateBack()
        } else {
          App.handleError(res)
        }
      }
    });
  }
})