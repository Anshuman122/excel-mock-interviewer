import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const startSession = async () => {
  const resp = await axios.post(`${API_URL}/session`);
  return resp.data;
};

export const sendAnswer = async (sessionId, answer) => {
  const resp = await axios.post(`${API_URL}/session/${sessionId}/message`, { answer });
  return resp.data;
};

export const submitExcel = async (sessionId, file) => {
  const formData = new FormData();
  formData.append("excel_file", file);
  formData.append("answer", "Final Excel submission");

  const resp = await axios.post(`${API_URL}/session/${sessionId}/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return resp.data;
};