// pages/account/account.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp();

Page({

  data: {
    markers: [],
    polyline: [{
      points: [],
      color: '#ff6666',
      width: 3,
      dottedLine: true
    }],
    mapH: '',
    hideMap: true,
    myLocation: null,
    myGeo: '获取定位'
  },

  onLoad() {
    // 计算窗口高度(规定屏幕宽为750rpx)
    let winH = app.globalData.windowH;
    let winW = app.globalData.windowW;
    let radio = 750 / winW;
    let mapH = radio * winH - 184;
    this.setData({
      mapH: mapH + 'rpx'
    });

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'LMQBZ-OXCWP-L4UDY-LVZNI-TZ3J2-TFBBZ'
    });
  },

  onShow: function () {
    let _this = this;
    // 调用qqmapsdk接口
    qqmapsdk.geocoder({
      address: '北京市天安门广场',
      success: function (res) {
        let loc = res.result.location;
        _this.setData({
          markers: [{
            id: 0,
            iconPath: '/images/icon/star.png',
            latitude: loc.lat,
            longitude: loc.lng,
            width: 30,
            height: 30
          }],
          'polyline[0].points': [{
            latitude: loc.lat,
            longitude: loc.lng
          }],
        })
      }
    });
  },

  //获取位置
  getLocation() {
    let _this = this;

    //规划路线之后，多次点击定位，要将路线初始化。
    let points = this.data.polyline[0].points;
    points.length = 1;
    this.setData({
      'polyline[0].points': points,
    })

    //获取当前位置经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let markers = _this.data.markers;
        markers.push({
          id: 0,
          iconPath: '/images/icon/marker.png',
          latitude: res.latitude,
          longitude: res.longitude,
          width: 50,
          height: 50
        });
        _this.setData({
          markers: markers,
          hideMap: false,
          myLocation: {
            latitude: res.latitude,
            longitude: res.longitude,
          }
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '获取定位失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    });

    //逆地址解析
    qqmapsdk.reverseGeocoder({
      location: this.data.myLocation,
      success: function(res){
        _this.setData({
          myGeo: res.result.address
        })
      }
    })


  },

  //计算距离
  getDistance(){
    let points = this.data.polyline[0].points;
    points.push(this.data.myLocation);
    this.setData({
      'polyline[0].points': points,
    })
  }


})