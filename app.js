var config = require( './config.js' );

App({
  globalData: {
    hasLogin:      false,
    userInfo:      {},
    encryptedData: "",
    iv:            "",
    sid:           "",
    uid:           "",

    promoterTotal: 0,
  },

  userInfoResponders: [],
  addUserInfoResponder: function (responder) {
    if (responder) {
      this.userInfoResponders.push(responder);
      (!!this.globalData.userInfo) && responder( this.globalData.userInfo )
    }
  },

  onLaunch: function () {
    // wx.setStorageSync('global.userId', "")
  },

  onShow: function () {
  },
  
  onHide: function () {
  },

  handleUserInfoChanged() {
    for (var idx = 0; idx < this.userInfoResponders.length; idx++) {
      this.userInfoResponders[idx]( this.globalData.userInfo );
    }
  },

  handleError: function( res ) {
    if (!res) {
      return false;
    }

    switch( res.data.errNo ) {
    case 400: {
      this.userInfoResponders  = []
      this.globalData.hasLogin = false
      wx.removeStorageSync( 'token' )
      wx.redirectTo({
        url: '/page/wxLogin/index',
      })
    } break;

    default: return false;
    }
  }
})
