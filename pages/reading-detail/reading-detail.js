// pages/reading/reading-detail/reading-detail.js
var readingData = require('../../data/reading-data.js');
var app = getApp();
Page({

  data: {
    readingDetail: {},
    isCollect: null,
    readingId: '',
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 获取阅读列表数据
    let detailData = readingData.reading.filter(item => item.readingId == options.readingId)[0];
    this.setData({
      readingDetail: detailData,
      readingId: options.readingId
    });

    // 设置缓存
    //假使缓存的样式是一个对象，key为readingId
    // let readingCollected = {
    //   1: 'true',
    //   2: 'false',
    //   5: 'false'
    // };
    let readingCollected = wx.getStorageSync('readingCollected');
    //判定是否有缓存
    if (readingCollected) {
      //当前这个id是否有缓存
      let collected = readingCollected[options.readingId] ? readingCollected[options.readingId] : false;
      readingCollected[options.readingId] = collected;
      this.setData({
        isCollect: collected
      });
      wx.setStorageSync('readingCollected', readingCollected);
    } else {
      readingCollected = {};
      readingCollected[options.readingId] = false;
      wx.setStorageSync('readingCollected', readingCollected);
    }

    

    //音乐播放功能
    let g_isPlay = app.globalData.g_isPlayMusic;
    let g_playId = app.globalData.g_currentMusicReadingId;
    //判定当前播放音乐的id是不是当前打开的页面id
    if (g_isPlay && (g_playId == this.data.readingId)) {
      this.setData({
        isPlay: true
      })
    } else {
      wx.stopBackgroundAudio();
    }

    //监听音乐事件
    this.setMusicMonitor();

  },

  //监听音乐播放、暂停、停止事件
  setMusicMonitor: function() {
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlay: true
      });
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicReadingId = this.data.readingId;
    });
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlay: false
      });
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicReadingId = null;
    });
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlay: false
      });
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicReadingId = null;
    });
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlay: false
      });
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentMusicReadingId = null;
    });
  },

  //点击收藏按钮
  onCollect: function(event) {
    let readingCollected = wx.getStorageSync('readingCollected');
    let collected = readingCollected[this.data.readingId];

    wx.showModal({
      title: '提示',
      content: collected ? '是否取消收藏' : '是否收藏',
      cancelText: collected ? '不取消' : '不收藏',
      confirmText: collected ? '取消收藏' : '收藏',
      success: (res) => {
        if (res.confirm) {
          readingCollected[this.data.readingId] = !collected;
          wx.setStorageSync('readingCollected', readingCollected);
          this.setData({
            isCollect: !collected
          });
          wx.showToast({
            title: !collected ? '收藏成功' : '取消收藏',
          });
        }
      }
    })

  },

  //点击分享按钮
  onShare: function() {
    let itemList = ['分享给微信好友', '分享到朋友圈', '分享到QQ', '分享到微博'];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: (res) => {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '确定要分享吗?',
          confirmText: '分享',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.showToast({
                title: '分享成功',
              })
            }
          }
        });
      },
      fail: (res) => {
        console.log(res.errorMsg)
      }
    })
  },

  //播放音乐
  playOrPause: function(event) {
    let _isPlay = this.data.isPlay;
    let musicInfo = this.data.readingDetail.music;

    this.setData({
      isPlay: !_isPlay
    });

    if (_isPlay) {
      wx.pauseBackgroundAudio();
    } else {
      wx.playBackgroundAudio({
        dataUrl: musicInfo.url,
        title: musicInfo.title,
        coverImgUrl: musicInfo.coverImg
      });
    }

  }

})