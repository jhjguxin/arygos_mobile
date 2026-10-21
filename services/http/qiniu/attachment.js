import http from '@/services/http/interface';

const callback = (data = {}) => {
  return http.request({
    url: '/api/v2/qiniu/attachments/callback',
    method: 'POST',
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/qiniu/attachments',
    method: 'POST',
    needAuth: true,
    data,
  });
};

export {
  callback,
  create
};