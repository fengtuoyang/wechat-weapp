// pages/movie-detail/movie-detail.js
let utils = require('../../utils/util.js');
let app = getApp();
Page({

  data: {
    movie: {}
  },

  onLoad: function(options) {
    let movieId = options.id;
    let url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    utils.http(url, this.processDoubanData);
  },

  processDoubanData: function(data) {
    if(!data){
      return;
    }

    let director = {
      avatar: '',
      name: ''
    };
    if (data.directors[0] != null) {
      director.avatar = data.directors[0].avatars.large ? data.directors[0].avatars.large : '';
      director.name = data.directors[0].name;
    }
    let movie = {
      movieImg: data.images.large ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('/'),
      stars: utils.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: utils.convertToCastsString(data.casts),
      castInfos: utils.convertToCastInfos(data.casts),
      summary: data.summary
    }; 
    this.setData({
      movie: movie
    });
  },

  scanImg: function(event){
    let url = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: [url],
    })
  }

})