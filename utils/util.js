const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//请求函数
function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      callback(res.data);
    }
  })
}

//对评分星星进行处理 
//参数：字符串  结果：数组
//因为用了豆瓣api，豆瓣的评分星星在接口有返回，比如7分，rating中的stars值为'35',意思是3.5个星星，在这里我们只考虑完整的星星，不开率半颗星，所以只取第一位。
function convertToStarsArray(stars) {
  let _stars = stars.substring(0, 1);
  let starsArr = [];
  for (let i = 0; i < 5; i++) {
    if (i < _stars) {
      starsArr.push(1);
    } else {
      starsArr.push(0);
    }
  }
  return starsArr;
}

//将数组中的演员名称拼接成字符串
function convertToCastsString(casts){
  let castsStr = '';
  casts.forEach(it => {
    castsStr = castsStr + it.name + '/';
  });
  return castsStr.substring(0, castsStr.length-1);
}

//将数组中的演员信息拼接成数组
function convertToCastInfos(casts) {
  let castsArray = [];
  casts.forEach(it => {
    let cast = {
      avatar: it.avatars.large ? it.avatars.large : '',
      name: it.name
    };
    castsArray.push(cast);
  });
  return castsArray;
}


module.exports = {
  formatTime: formatTime,
  http: http,
  convertToStarsArray: convertToStarsArray,
  convertToCastsString: convertToCastsString,
  convertToCastInfos: convertToCastInfos
}