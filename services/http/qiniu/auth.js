import http from './../interface';

const upload_token = (data = {}) => {
  return http.request({
    url: '/api/qiniu/auth/upload_token',
    method: 'GET',
    data,
  });
};

const download_url = (data = {}) => {
  data.device = "h5";

  return http.request({
    url: '/api/qiniu/auth/download_url',
    method: 'GET',
    data,
  });
};

export default {
  upload_token,
  download_url
};