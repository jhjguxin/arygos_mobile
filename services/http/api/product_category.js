import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/product_categories',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data) => {
  return http.request({
    url: '/api/v2/product_categories/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const tree = (data) => {
  return http.request({
    url: '/api/v2/product_categories/tree',
    method: 'GET',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, tree
};