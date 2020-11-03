import http from './../interface';

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/contracts/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};


export default {
  simple
};