import http from './../interface';

const entity_search_column = (data = {}) => {
  return http.request({
    url: '/api/v2/user_settings/entity_search_column',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const entity_sort_column = (data = {}) => {
  return http.request({
    url: '/api/v2/user_settings/entity_sort_column',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const default_entity_list_table = (data = {}) => {
  return http.request({
    url: '/api/v2/user_settings/default_entity_list_table',
    method: 'GET',
    needAuth: true,
    data,
  });
};


export default {
  default_entity_list_table,
};