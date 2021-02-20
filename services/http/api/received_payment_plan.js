import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/received_payment_plans',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/received_payment_plans/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/received_payment_plans',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/received_payment_plans/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const received_payments = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/received_payment_plans/${id}/received_payments`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/received_payment_plans/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};


const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/received_payment_plans/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, create, show,
  received_payments,
  update,
  mass_destroy
};