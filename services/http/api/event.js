import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/events',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const related_item = (data) => {
  return http.request({
    url: `/api/v2/events/related_item`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const expired = (data) => {
  return http.request({
    url: `/api/v2/events/expired`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const expired_dot = (data) => {
  return http.request({
    url: `/api/v2/events/expired_dot`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/events',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/events/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const complate = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/events/${id}/complate`,
    method: 'POST',
    needAuth: true,
    data,
  });
};


const destroy = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/events/${id}`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index,
  related_item,
  expired,
  expired_dot,
  create,
  update,
  complate,
  destroy
};