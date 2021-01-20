import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/knowledge_articles',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const show = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/knowledge_articles/${id}`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const update_views= (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/knowledge_articles/${id}/update_views`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

export default {
  index, show, update_views
};