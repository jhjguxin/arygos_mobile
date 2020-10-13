import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/notifications',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const newest = (data) => {
  return http.request({
    url: '/api/v2/notifications/newest',
    method: 'GET', 
    needAuth: true,
    data,
  });
};

const read = (data) => {
  let { id } = data;
  delete data["id"];
  
  return http.request({
    url: `/api/v2/notifications/${id}/read`,
    method: 'POST', 
    needAuth: true,
    data,
  });
};

const read_all = (data) => {
  return http.request({
    url: '/api/v2/notifications/read_all',
    method: 'POST', 
    needAuth: true,
    data,
  });
};

const destroy_all = (data) => {
  return http.request({
    url: '/api/v2/notifications/destroy_all',
    method: 'DELETE', 
    needAuth: true,
    data,
  });
};

export default {
  index,
  newest,
  read,
  read_all,
  destroy_all
};