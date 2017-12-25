var config = require("../../config.js");

Page({
  data: {
    background: ['../../image/home/0.jpg', '../../image/home/1.jpg', '../../image/home/2.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    userInfo: {
      nickname: '',
      post: 0,
      userId: 888888,
      diamond: 88888888
    },
    products: [],

    mode: {
      mode: 'scaleToFill',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
    }
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
  },

  // swiperImageLoad: function( event ) {
  //    var $width=e.detail.width,    //获取图片真实宽度
  //        $height=e.detail.height,
  //        ratio=$width/$height;    //图片的真实宽高比例
  //    var viewWidth=718,           //设置图片显示宽度，左右留有16rpx边距
  //        viewHeight=718/ratio;    //计算的高度值
  //     var image=this.data.images; 
  //     //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
  //     image[e.target.dataset.index]={
  //        width:viewWidth,
  //        height:viewHeight
  //     }
  //     this.setData({
  //          images:image
  //     })
  // }
})
