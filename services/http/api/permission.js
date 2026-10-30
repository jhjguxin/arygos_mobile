import http from '@/services/http/interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/permissions',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

export default {
  index
};