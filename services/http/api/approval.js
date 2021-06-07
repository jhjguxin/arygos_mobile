import http from './../interface';

const current = (data = {}) => {
  return http.request({
    url: '/api/v2/approvals/current',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const applying_list = (data = {}) => {
  return http.request({
    url: '/api/v2/approvals/applying_list',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const approved_list = (data = {}) => {
  return http.request({
    url: '/api/v2/approvals/approved_list',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const approval_detail = (data) => {
  return http.request({
    url: `/api/v2/approvals/approval_detail`,
    method: 'GET',
    needAuth: true,
    data,
  });
};

const operations = (data = {}) => {
  return http.request({
    url: '/api/v2/approvals/operations',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const applying = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/approvals/applying`,
    method: 'POST',
    needAuth: true,
    data,
  });
};


const approve = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/approvals/approve`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const deny = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/approvals/deny`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

const revert = (data) => {
  let { id } = data;
  delete data["id"];

  return http.request({
    url: `/api/v2/approvals/revert`,
    method: 'POST',
    needAuth: true,
    data,
  });
};

export default {
  current,
  applying_list, approved_list,
  approval_detail,
  operations,
  applying, approve, deny, revert
};