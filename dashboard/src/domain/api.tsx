import axios from 'axios';
import { config } from "../config/config";

export type SendRecordPayload = { file: any };

export function sendRecord(payload: SendRecordPayload) {
  const form = new FormData();

  form.append("file", payload.file);

  return axios.post(`${config.apiUrl}/conversation/upload `, form, {
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  });
}

export function createChat() {
  return axios.post(`${config.apiUrl}/conversation/create`);
}


//
// export function addFlat(payload: SendModelPayload) {
//   const form = new FormData();
//
//   form.append("file", payload.file);
//
//   return axios.post(`${config.apiUrl}/process_floorplan`, form, {
//     headers: {
//       'Content-Type': `multipart/form-data;`,
//     },
//   });
// }
//
// export function getJobs() {
//   return axios.get(`${config.apiUrl}/jobs`);
// }
//
// export function getJob(id: number | string) {
//   return axios.get(`${config.apiUrl}/jobs/${id}`);
// }
//
// export async function getFlats() {
//   const flats = await axios.get(`${config.apiUrl}/flats`);
//
//   return flats.data;
// }
//
// export async function getFlat(id: number | string) {
//   const flat = await axios.get(`${config.apiUrl}/flat/${id}`);
//
//   return flat.data;
// }
//
// export async function getFlatScans(id: number | string) {
//   const scans = await axios.get(`${config.apiUrl}/flat_scan_by_flat/${id}`);
//
//   return scans.data;
// }
