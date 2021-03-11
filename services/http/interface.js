import {config} from 'config';
const qs = require('qs');

/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */

/*
// 开放的接口
import http from './interface'

http.config.baseUrl = "http://localhost:8080/api/"

http.request(url:'user/list',method:'GET').then((res)=>{
  console.log(JSON.stringify(res))
})
*/
export default {
  config: {
    baseUrl: config["API_HOST"],
    header: {
      'Content-Type':'application/json;charset=UTF-8'
    },
    data: {},
    method: "GET",
    dataType: "json",
    responseType: "text",
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    request: null,
    response: null
  },
  request(options) {
    if (!options) {
      options = {}
    }
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    options.url = options.baseUrl + options.url
    options.data = options.data ? JSON.parse(JSON.stringify(options.data)) : {}
    options.method = options.method || this.config.method

    // REVIEW uni-app 不支持 object 嵌套 数组因此提前拼接 data 到 url
    let [url, query] = options.url.split("?");
    if (query) {
      options.data = _.extend(options.data, qs.parse(query, {arrayFormat: 'brackets'}));
    }

    if (options.method == "GET") {
      if (!_.isEmpty(options.data)) {
        query = qs.stringify(options.data, {arrayFormat: 'brackets'});
        options.url = `${url}?${query}`
        options.data = null
      }
    }

    //TODO 加密数据

    //TODO 数据签名
    /*
    _token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
    _sign = {'sign': sign(JSON.stringify(options.data))}
    options.header = Object.assign({}, options.header, _token,_sign)
    */

    if (options.needAuth) {
      const userToken = getApp().$store.getters.getAuthToken;
      const header = {
        'Authorization': `Bearer token="${userToken}", device="h5"`
      };
      options.header = Object.assign({}, options.header, header)
    }

    return new Promise((resolve, reject) => {
      let _config = null;

      // REVIEW showLoading 会和其他的 Toast 冲突一般建议在 Get 请求中开启
      if (options.showLoading) {
        uni.showLoading({
          title: '加载中'
        });
      };

      options.complete = (response) => {
        let statusCode = response.statusCode;
        response.config = _config;

        if (options.showLoading) {
          uni.hideLoading();
        }

        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response);

          if (newResponse) {
            response = newResponse;
          }
        }
        if (options.dataType) {
          // REVIEW 小程序 App 不支持 null
          // https://uniapp.dcloud.io/use
          // https://ask.dcloud.net.cn/question/99391
          // https://ask.dcloud.net.cn/article/37342
          // const replacer = function (key, value) {
          //   // Filtering out properties
          //   if (_.isNil(value)) {
          //     return "";
          //   }
          //   return value;
          // }

          // // response.data = JSON.parse(
          // //   JSON.stringify(response.data, replacer)
          // // )

          // REVIEW 如果后端返回登陆过期则清除本地存储退出登陆
          if (response.data.code == 100401) {
            uni.clearStorage();
          }
        }

        // 统一的响应日志记录
        _reslog(response);
        if (statusCode === 200) { //成功
          resolve(response);
        } else {
          reject(response)
        }
      }

      _config = Object.assign({}, this.config, options);
      _config.requestId = new Date().getTime();

      if (this.interceptor.request) {
        this.interceptor.request(_config)
      }

      // 统一的请求日志记录
      _reqlog(_config);

      uni.request(_config);
    });
  }
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
  if (process.env.NODE_ENV === 'development') {
    console.log("【" + req.requestId + "】 地址：" + req.url)
    if (req.data) {
      console.log("【" + req.requestId + "】 参数：" + JSON.stringify(req.data))
    }
  }
  // TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
  let _statusCode = res.statusCode;
  if (process.env.NODE_ENV === 'development') {
    console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
    if (res.config.data) {
      console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
    }
    console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res.data))
  }

  //TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
  switch(_statusCode){
    case 200:
      break;
    case 401:
      break;
    case 404:
      break;
    case 500:
      uni.showToast({
        icon: 'none',
        title: "服务器处理异常"
      });
      break;
    default:
      uni.showToast({
        icon: 'none',
        title: "连接服务器失败"
      });
      break;
  }
}