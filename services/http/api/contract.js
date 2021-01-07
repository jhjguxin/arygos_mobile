import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/contracts',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/contracts/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/contracts',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contracts/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contact_assetships = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contracts/${id}/contact_assetships`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const product_assets = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contracts/${id}/product_assets`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contracts/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const transfer = (data) => {
  return http.request({
    url: `/api/v2/contracts/transfer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/contracts/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, create, show,
  contact_assetships, product_assets,
  update,
  transfer,
  mass_destroy
};