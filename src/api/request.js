/**
 * 网络请求封装函数 (Axios版)
 * @description 使用Axios代替Fetch API，支持请求和响应拦截器
 */
import axios from 'axios';
import { apiKey } from './apiKey'; // 修改为命名导入

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://81.68.224.194:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': apiKey // 如果需要的话
  }
});

// 默认配置
const defaultCustomOptions = {
  repeatRequestCancel: true, // 是否开启取消重复请求
  errorMessageShow: true, // 是否开启接口错误信息展示
  loading: true // 是否开启loading层效果
};

// 存储请求，用于取消重复请求
const pendingRequests = new Map();

/**
 * 生成请求Key
 * @param {Object} config - 请求配置
 * @returns {String} 请求Key
 */
const generateRequestKey = (config) => {
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
};

/**
 * 添加请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url);
    
    // 合并自定义配置
    const customOptions = Object.assign({}, defaultCustomOptions, config.customOptions || {});
    config.customOptions = customOptions;

    // 取消重复请求
    if (customOptions.repeatRequestCancel) {
      const requestKey = generateRequestKey(config);
      if (pendingRequests.has(requestKey)) {
        const controller = pendingRequests.get(requestKey);
        controller.abort();
        pendingRequests.delete(requestKey);
      }
      
      const controller = new AbortController();
      config.signal = controller.signal;
      pendingRequests.set(requestKey, controller);
    }

    // 显示loading
    if (customOptions.loading) {
      // 这里可以添加显示loading的代码
      // 例如: showLoading();
    }

    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.config.url, response.status);
    
    // 取消重复请求Map中对应的内容
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);
    
    // 隐藏loading
    if (response.config.customOptions?.loading) {
      // 这里可以添加隐藏loading的代码
      // 例如: hideLoading();
    }

    // 返回数据
    return response.data;
  },
  (error) => {
    console.error('响应错误:', error.message, error?.response?.status, error?.config?.url);
    
    // 请求被取消不进行错误处理
    if (axios.isCancel(error)) {
      console.log('请求被取消');
      return new Promise(() => {});
    }
    
    // 请求配置
    const config = error.config || {};
    // 取消重复请求Map中对应的内容
    const requestKey = generateRequestKey(config);
    pendingRequests.delete(requestKey);
    
    // 隐藏loading
    if (config.customOptions?.loading) {
      // 这里可以添加隐藏loading的代码
      // 例如: hideLoading();
    }

    // 处理错误信息
    if (config.customOptions?.errorMessageShow) {
      // 这里可以添加错误提示的代码
      // 例如: showErrorMessage(error.message);
      console.error('请求错误:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * 请求方法
 * @param {String} url - 请求地址
 * @param {Object} options - 请求配置项
 * @param {Object} customOptions - 自定义配置项
 * @param {Function} successFn - 成功回调函数
 * @param {Function} errorFn - 错误回调函数
 * @returns {Promise} 返回Promise对象
 */
const request = (url, options = {}, customOptions = {}, successFn, errorFn) => {
  // 合并配置
  const config = {
    url,
    ...options,
    customOptions
  };

  return instance.request(config)
    .then(data => {
      if (successFn) successFn(data);
      return data;
    })
    .catch(error => {
      if (errorFn) errorFn(error);
      return Promise.reject(error);
    });
};

// 导出请求实例和方法
export default request;

// 导出axios实例，便于直接使用
export { instance as axios };

// 便捷方法
export const get = (url, params = {}, customOptions = {}, successFn, errorFn) => {
  return request(url, { method: 'GET', params }, customOptions, successFn, errorFn);
};

export const post = (url, data = {}, customOptions = {}, successFn, errorFn) => {
  return request(url, { method: 'POST', data }, customOptions, successFn, errorFn);
};

export const put = (url, data = {}, customOptions = {}, successFn, errorFn) => {
  return request(url, { method: 'PUT', data }, customOptions, successFn, errorFn);
};

export const del = (url, params = {}, customOptions = {}, successFn, errorFn) => {
  return request(url, { method: 'DELETE', params }, customOptions, successFn, errorFn);
};