// pages/movies/movies.js
var utils = require('../../utils/util.js');
var app = getApp();
Page({

  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    searchPannelShow: false,
    searchValue: ''
  },

  onLoad: function(event) {
    let inTheatersUrl = '/v2/movie/in_theaters?start=0&count=3';
    let comingSoonUrl = '/v2/movie/coming_soon?start=0&count=3';
    let top250Url = '/v2/movie/top250?start=0&count=3';

    //正在热映
    this.getMoviesListData(inTheatersUrl, 'inTheaters', '正在热映');
    //即将上映
    this.getMoviesListData(comingSoonUrl, 'comingSoon', '即将上映');
    //top250
    this.getMoviesListData(top250Url, 'top250', '豆瓣Top250');

  },

  //封装请求函数
  getMoviesListData: function(url, key, categoryTitle) {
    wx.request({
      url: app.globalData.doubanBase + url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        this.processDoubanData(res.data, key, categoryTitle);
      }
    })
  },

  //接收从豆瓣api获取的数据，进行处理，拿到自己需要的数据方便数据绑定
  processDoubanData: function(moviesDouban, key, categoryTitle) {
    let movies = [];
    moviesDouban.subjects.forEach(it => {
      //对title进行处理
      let title = it.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      //对评分星星进行处理[1,1,1,0,0]
      let starsArr = utils.convertToStarsArray(it.rating.stars);

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

    let readyData = this.data;
    readyData[key] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyData, () => {
      wx.hideNavigationBarLoading();
    });
  },

  //打开“更多”
  openMoreMovie: function(event) {
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '../more-movie/more-movie?category=' + category,
      success: function(res) {}
    })
  },

  //电影搜索
  onSearchFocus: function(event) {
    this.setData({
      searchPannelShow: true
    });
  },

  onSearchConfirm: function(event) {
    let keyWord = event.detail.value;
    if (keyWord != '') {
      let searchUrl = '/v2/movie/search?q=' + keyWord;
      this.getMoviesListData(searchUrl, 'searchMovies', '搜索电影');
      this.setData({
        searchValue: keyWord
      });
      wx.showNavigationBarLoading();
    }
  },

  onSearchCancel: function(event) {
    this.setData({
      searchPannelShow: false,
      searchValue: '',
      searchMovies: []
    });
    wx.hideNavigationBarLoading();    
  },

  //打开电影详情页面
  openMovieDetail: function(event){
    let movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    });
  }


})