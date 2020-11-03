import http from './../interface';

const countries = (data = {}) => {
  data.device = "h5";

  return http.request({
    url: '/api/v2/geo/countries',
    method: 'GET',
    data,
  });
};

const provinces = (data = {}) => {
  data.device = "h5";

  return http.request({
    url: '/api/v2/geo/provinces',
    method: 'GET',
    data,
  });
};

const cities = (data = {}) => {
  data.device = "h5";

  return http.request({
    url: '/api/v2/geo/cities',
    method: 'GET',
    data,
  });
};

const districts = (data = {}) => {
  data.device = "h5";

  return http.request({
    url: '/api/v2/geo/districts',
    method: 'GET',
    data,
  });
};

export default {
  countries, provinces,
  cities, districts
};