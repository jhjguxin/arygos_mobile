import http from '@/services/http/interface';

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/users/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};


export default {
  simple
};