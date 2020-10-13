import http from './../interface';

const login = (data) => {
  data.device = "h5";
  
  return http.request({
    url: '/api/v2/auth/sign_in',
    method: 'POST',
    showLoading: true,
    data,
  });
};
const sign_out = (data) => {
  return http.request({
    url: '/api/v2/auth/sign_out',
    method: 'DELETE', 
    needAuth: true,
    data,
  });
};

export default {
  login,
  sign_out
}