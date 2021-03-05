import http from './../interface';

const entity_add = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/entity_add',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const revisit_log = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/revisit_log',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const sales_funnel = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/sales_funnel',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const received_payment_plan = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/received_payment_plan',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const won_opportunity = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/won_opportunity',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contract = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/contract',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const customer_count = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/customer_count',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const opportunity_amount = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/opportunity_amount',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const contract_amount = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/contract_amount',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const received_payment_amount = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/received_payment_amount',
    method: 'GET',
    needAuth: true,
    data,
  });
};

const product_sales = (data = {}) => {
  return http.request({
    url: '/api/v2/report_center/product_sales',
    method: 'GET',
    needAuth: true,
    data,
  });
};


export default {
  entity_add, revisit_log, sales_funnel,
  received_payment_plan, won_opportunity,
  contract, customer_count, opportunity_amount,
  contract_amount, received_payment_amount,
  product_sales
};