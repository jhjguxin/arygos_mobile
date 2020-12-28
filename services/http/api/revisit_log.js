import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/revisit_logs',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const latest = (data) => {
  return http.request({
    url: '/api/v2/revisit_logs/latest',
    method: 'GET',
    needAuth: true,
    data,
  });
};
const create = (data = {}) => {
  return http.request({
    url: '/api/v2/revisit_logs',
    method: 'POST',
    needAuth: true,
    data,
  });
};

export default {
  index,
  latest,
  create
}