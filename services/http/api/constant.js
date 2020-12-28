import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/constants',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const global = (data) => {
  return http.request({
    url: '/api/v2/constants/global',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const feature = (data) => {
  return http.request({
    url: '/api/v2/constants/feature',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const custom_field_form = (data) => {
  return http.request({
    url: '/api/v2/constants/custom_field_form',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const custom_field = (data) => {
  return http.request({
    url: '/api/v2/constants/custom_field',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const custom_field_group = (data) => {
  return http.request({
    url: '/api/v2/constants/custom_field_group',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

export default {
  index,
  global,
  feature,
  custom_field_form,
  custom_field,
  custom_field_group
}