import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/contacts',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const simple = (data = {}) => {
  return http.request({
    url: '/api/v2/contacts/simple',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const create = (data = {}) => {
  return http.request({
    url: '/api/v2/contacts',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contacts/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/contacts/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};


const mass_destroy = (data) => {
  return http.request({
    url: `/api/v2/contacts/mass_destroy`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index, simple, create, show,
  update,
  mass_destroy
};