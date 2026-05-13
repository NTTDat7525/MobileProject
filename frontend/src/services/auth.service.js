import api from './api';

export const signin = (username, password) =>
  api.post('/auth/signin', { username, password });

export const signup = (data) =>
  api.post('/auth/signup', data);

export const signout = () =>
  api.post('/auth/signout');

export const getMe = () =>
  api.get('/users/me');

export const updateProfile = (data) =>
  api.put('/users/profile', data);
