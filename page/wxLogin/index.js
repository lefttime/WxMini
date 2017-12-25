var config = require( "../../config.js" );

const App = getApp()

Page({
  data: {
    logged: !1,
  },

  loginResponders: [],
  addLoginResponder: function (responder) {
    this.loginResponders.push( responder );
  },

  onLoad() {},

  onShow() {
    App.globalData.sid = wx.getStorageSync( 'token'         )
    App.globalData.uid = wx.getStorageSync( 'global.userId' )
    this.setData({
      logged: !!App.globalData.sid
    })
    if (App.globalData.sid) {
      this.fetchWxUserInfo( null )
      setTimeout( this.goIndex, 1000 )
    }
  },

  fetchWxUserInfo( responder ) {
    wx.request({
      url: config.api.fetchWxUserInfo,
      data: {},
      header: {
        'content-type': 'application/json',
        'Cookie': "sid=" + App.globalData.sid
      },
      method: "POST",
      success: function (res) {
        if (res && !res.data.errNo) {
          App.globalData.userInfo = JSON.parse( res.data.data )
          !!responder && responder( res )
        }
      }
    });
  },

  login() {
    var self = this;
    var resData = {};
    var jsCodeDone, userInfoDone, systemInfoDone;

    function fetchWxUserInfo( res ) {
      if (res && !res.data.errNo) {
        wx.hideToast()
        self.goIndex()
      }
    }

    function setWxUserInfo() {
      wx.request({
        url: config.api.setWxAppUser,
        data: {
          encryptedData: resData.encryptedData,
          iv:            resData.iv,
          platform:      resData.platform,
        },
        header: {
          'content-type': 'application/json',
          'Cookie': "sid=" + resData.sid
        },
        method: "POST",
        success: function (res) {
          App.globalData.hasLogin      = true;
          App.globalData.encryptedData = resData.encryptedData;
          App.globalData.iv            = resData.iv;
          App.globalData.sid           = resData.sid;
          self.fetchWxUserInfo( fetchWxUserInfo )
        }
      });
    }

    wx.showToast({
      title: '正在登录小程序',
      icon:  'loading',
      duration: 5000,
      mask: true,
    })

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: config.api.wxAppLogin,
            data: {
              code: res.code
            },
            success: function (res) {
              resData.sid = res.data.data.sid;
              jsCodeDone = true;
              jsCodeDone && userInfoDone && systemInfoDone && setWxUserInfo();
              wx.setStorageSync( 'token', resData.sid )
            }
          });

          wx.getUserInfo({
            success: function (res) {
              resData.userInfo      = res.userInfo;
              resData.encryptedData = res.encryptedData;
              resData.iv            = res.iv;
              userInfoDone          = true;
              jsCodeDone && userInfoDone && systemInfoDone && setWxUserInfo();
            }
          });

          wx.getSystemInfo({
            success: function (res) {
              resData.platform = res.platform;
              systemInfoDone   = true;
              jsCodeDone && userInfoDone && systemInfoDone && setWxUserInfo();
            }
          });
        }
      }
    });
  },

  goIndex() {
    wx.switchTab({
      url: '../home/index',
    })
  }
})