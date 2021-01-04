import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/customers',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/customers/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/customers',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customers/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contacts = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customers/${id}/contacts`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const opportunities = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customers/${id}/opportunities`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contracts = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customers/${id}/contracts`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customers/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const transfer = (data) => {
  return http.request({
    url: `/api/v2/customers/transfer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/customers/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};


export default {
  index, simple, create, show,
  contacts, opportunities, contracts,
  update, transfer,
  mass_destroy
};