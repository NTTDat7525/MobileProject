import api from './api';

export const getTables = (params) =>
  api.get('/users/tables', { params });

export const getTableById = (id) =>
  api.get(`/users/tables/${id}`);

export const getTableStatus = () =>
  api.get('/admin/tables/status');

export const addTable = (data) =>
  api.post('/admin/tables', data,{
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateTable = (id, data) =>
  api.put(`/admin/tables/${id}`, data);

export const deleteTable = (id) =>
  api.delete(`/admin/tables/${id}`);
