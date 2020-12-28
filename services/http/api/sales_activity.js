import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/sales_activities',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const comments = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/sales_activities/${id}/comments`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const comment = (data) => {
  let { sales_activity: {id}, sales_activity_comment } = data;
  delete data["sales_activity"];

  return http.request({
    url: `/api/v2/sales_activities/${id}/comment`,
    method: 'POST',
    needAuth: true,
    data: {
      id,
      ...sales_activity_comment
    }
  });
};

const destroy_comment = (data) => {
  let { sales_activity: {id}, comment_id } = data;
  delete data["sales_activity"];

  return http.request({
    url: `/api/v2/sales_activities/${id}/destroy_comment`,
    method: 'DELETE',
    needAuth: true,
    data,
  });
};

export default {
  index,
  comments,
  comment,
  destroy_comment
}