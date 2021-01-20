import http from './../interface';

const index = (data) => {
  return http.request({
    url: '/api/v2/knowledge_sections',
    method: 'GET',
    needAuth: true,
    data,
  });
};

export default {
  index
};