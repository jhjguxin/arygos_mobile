import {config} from 'config';

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
http.get('user/list').then((res)=>{
  console.log(JSON.stringify(res))
})
http.get('user/list', {status: 1}).then((res)=>{
  console.log(JSON.stringify(res))
})
http.post('user', {id:1, status: 1}).then((res)=>{
  console.log(JSON.stringify(res))
})
http.put('user/1', {status: 2}).then((res)=>{
  console.log(JSON.stringify(res))
})
http.delete('user/1').then((res)=>{
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
    options.data = options.data || {}
    options.method = options.method || this.config.method
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
        'Authorization': `Bearer token="${userToken}", device="web"`
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
  },
  get(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'GET'  
    return this.request(options)
  },
  post(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  },
  put(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options)
  },
  delete(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options)
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