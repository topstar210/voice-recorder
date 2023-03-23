import axios from "axios";
import store from "@/store";

const axiosJWT:any = axios.create({
  baseURL: process.env.REACT_APP_SERVERURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosJWT.interceptors.request.use(async (config:any) => {
  const appStore = store.getState();
  const { sapp } = appStore;
  config.headers.Authorization = `Bearer ${sapp.accToken}`;
  return config;
}, (error:any) => {
  return Promise.reject(error);
});
axiosJWT.defaults.withCredentials = true;

axiosJWT.auth = {
  login: (data:any) => axiosJWT.post(`/login`, {pin_code:data}),
  logout: (data:any) => axiosJWT.post(`/logout`, data),
  register: (data:any) => axiosJWT.post(`/register`, data),
  getToken: () => axiosJWT.get(`/token`),
};

axiosJWT.user = {
  save: (data:any) => axiosJWT.post(`users/save`, data),
  getUsers: () => axiosJWT.get(`users/get`),
  getInfo: (userId:string) => axiosJWT.get(`users/get/${userId}`),
  delete: (userId:string) => axiosJWT.delete(`users/${userId}`),
  checkFilePwd: (data:any) => axiosJWT.post(`users/checkfilepwd`, data),
}

axiosJWT.file = {
  save: (data:any) => axiosJWT.post(`/file/save`, data),
}
export default axiosJWT;
