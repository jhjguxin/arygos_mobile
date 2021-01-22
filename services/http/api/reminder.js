import http from './../interface';

const index = (data = {}) => {
  return http.request({
    url: '/api/v2/reminders',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const todo_dot = (data = {}) => {
  return http.request({
    url: '/api/v2/reminders/todo_dot',
    method: 'POST',
    needAuth: true,
    data,
  });
};

const complate = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/reminders/${id}/complate`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

export default {
  index,
  todo_dot,
  complate,
};