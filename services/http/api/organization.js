import http from '@/services/http/interface';

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