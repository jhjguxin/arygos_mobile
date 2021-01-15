import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/schedule_reports',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const due_at = (data) => {
  return http.request({
    url: '/api/v2/schedule_reports/due_at',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/schedule_reports',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const markings = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}/markings`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const marking = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}/marking`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const destroy_marking = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}/destroy_marking`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

const destroy = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/schedule_reports/${id}`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index,
  due_at,
  create,
  show, markings,
  update, marking, destroy_marking,
  destroy
};