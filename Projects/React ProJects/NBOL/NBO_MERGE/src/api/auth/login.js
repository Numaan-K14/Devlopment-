import axios from "axios";
export const loginAPI = async (data) => {
  const URL = `${import.meta.env.VITE_API_URL}/user/login`;
  const res = await axios.post(URL, data);
  return res.data;
};
