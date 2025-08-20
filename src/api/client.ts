import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
});

export const getPendingProjects = (email: string) =>
  api.get('/evidence/pending', { params: { email } }).then(r => r.data);

export const getHeadersConfig = () =>
  api.get('/config/header').then(r => r.data);

export const requestSasUrl = () => api.post('/upload/sas').then(r => r.data);

export const registerIngestion = (payload: unknown) =>
  api.post('/evidence/ingest', payload).then(r => r.data);
