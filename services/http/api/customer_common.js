import http from './../interface';

const customer_common_settings = (data = {}) => {
  return http.request({
    url: '/api/v2/customer_commons/customer_common_settings',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const customers = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/customers`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const transfer_into_common = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/transfer_into_common`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const grab = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/grab`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const transfer = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/transfer`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const transfer_to_other = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/transfer_to_other`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const mass_destroy = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/customer_commons/${id}/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  customer_common_settings,
  customers, transfer_into_common,
  grab, transfer, transfer_to_other,
  mass_destroy
};