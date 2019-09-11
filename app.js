//app.js
App({
  globalData: {
    //音乐播放器
    g_isPlayMusic: false,
    g_currentMusicReadingId: null,
    doubanBase: 'http://t.yushu.im',
    windowH: '',
    windowW: '',
  },

  onLaunch() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.globalData.windowH = res.windowHeight;
        _this.globalData.windowW = res.windowWidth;
      },
    });
  }

})