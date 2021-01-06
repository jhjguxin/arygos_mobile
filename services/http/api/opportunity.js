import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/opportunities',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/opportunities/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/opportunities',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contact_assetships = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}/contact_assetships`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const product_assets = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}/product_assets`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const build_contract = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}/build_contract`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};

const turn_contract = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/opportunities/${id}/turn_contract`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const transfer = (data) => {
  return http.request({
    url: `/api/v2/opportunities/transfer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/opportunities/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, create, show,
  contact_assetships, product_assets,
  build_contract, update,
  turn_contract, transfer,
  mass_destroy
};