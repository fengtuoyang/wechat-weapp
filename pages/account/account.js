// pages/account/account.js
Page({

  //form表单的事件处理函数

  // onSwitch: function(e){
  //   console.log(e.detail.value);
  // },

  // onSlidering: function (e) {
  //   console.log(e.detail.value);
  // },

  // onSlider: function (e) {
  //   console.log(e.detail.value);
  // },

  // onRadio: function (e) {
  //   console.log(e.detail.value);
  // },

  // onCheckbox: function(e){
  //   console.log(e.detail.value);
  // },

  // onFormSubmit: function(e){
  //   console.log(e.detail.value);
  // },

  // onFormReset: function(e){
  //   console.log('reset');
  // },

  //地图

  data: {
    markers: [{
      id: 0,
      iconPath: '/images/icon/marker.png',
      longitude: 113.324520,
      latitude: 23.099994,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      },{
        longitude: 113.324550,
        latitude: 23.099994
      }],
      color: '#f66',
      width: 6
    }]
  },

})