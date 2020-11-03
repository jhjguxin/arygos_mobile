import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/leads',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/leads/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/leads',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/leads/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const build_customer = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/leads/${id}/build_customer`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/leads/${id}`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const turn_customer = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/leads/${id}/turn_customer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const transfer = (data) => {
  return http.request({
    url: `/api/v2/leads/transfer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/leads/mass_destroy`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, create, show,
  build_customer, update,
  turn_customer, transfer,
  mass_destroy
};