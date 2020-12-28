import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/attachments',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/attachments/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/attachments/${id}`,
    method: 'PUT',
    needAuth: true,
    data,
  });
};


const destroy = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/attachments/${id}`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index,
  show,
  update,
  destroy
};