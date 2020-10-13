import http from './../interface';

const current = (data) => {
  return http.request({
    url: '/api/setting/organizations/current',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

export default {
  current
};