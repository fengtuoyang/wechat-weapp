var readingData = require('../../data/reading-data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readingList: [],
    swiperUrl: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      readingList: readingData.reading.slice(3),
      swiperUrl: readingData.reading.slice(0,3)
    });
  },

  openReadingDetail: function(event){
    let readingId = event.currentTarget.dataset.readingid;
    wx.navigateTo({
      url: '../reading-detail/reading-detail?readingId=' + readingId,
    });
    console.log(readingId)
  }

})