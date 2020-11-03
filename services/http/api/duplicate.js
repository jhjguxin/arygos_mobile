import http from './../interface';

const current = (data) => {
  return http.request({
    url: '/api/v2/duplicates/current',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const search = (data) => {
  return http.request({
    url: '/api/v2/duplicates/search',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const check = (data) => {
  return http.request({
    url: '/api/v2/duplicates/check',
    method: 'post',
    needAuth: true,
    data,
  });
};

export default {
  current,
  search,
  check
}