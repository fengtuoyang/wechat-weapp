// pages/more-movie/more-movie.js
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  data: {
    category: '',
    categoryKey: '',
    movies: [],
    requestUrl: '',
    totalcount: 0
  },

  onLoad: function(options) {
    let category = options.category;
    let dataUrl = '';
    let categoryKey = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        categoryKey = 'inTheaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        categoryKey = 'comingSoon';
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        categoryKey = 'top250';
        break;
    }
    this.setData({
      category: category,
      categoryKey: categoryKey,
      requestUrl: dataUrl
    }, () => {
      utils.http(dataUrl + '?start=0&count=12', this.processDoubanData);
    });
  },

  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.category,
    });
  },

  //接收从豆瓣api获取的数据，进行处理，拿到自己需要的数据方便数据绑定
  processDoubanData: function(moviesDouban) {
    let movies = this.data.movies;
    moviesDouban.subjects.forEach(it => {
      //对title进行处理
      let title = it.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      //对评分星星进行处理[1,1,1,0,0]
      let starsArr = utils.convertToStarsArray(it.rating.stars);
      //整合需要的数据
      let temp = {
        images: it.images.large,
        title: title,
        movieId: it.id,
        rating: {
          average: it.rating.average,
          stars: starsArr
        }
      };
      movies.push(temp);
    });

    //如果上面let movies=[]，就可以用下面这句，然后setData中movies为totalMovies
    // let totalMovies = this.data.movies.concat(movies);
    this.setData({
      movies: movies,
      totalcount: this.data.totalcount + 12
    }, () => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },

  //movie-grid scroll-view滚动到底部触发函数
  // onScrollLower: function(event){
  //   let nextUrl = this.data.requestUrl + '?start=' + this.data.totalcount + '&count=12';
  //   utils.http(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },

  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      movies: [],
      totalcount: 0
    }, () => {
      utils.http(this.data.requestUrl, this.processDoubanData);
    });
  },

  //上拉加载
  onReachBottom: function() {
    let nextUrl = this.data.requestUrl + '?start=' + this.data.totalcount + '&count=12';
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  //打开电影详情页面
  openMovieDetail: function (event) {
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    });
  }

})