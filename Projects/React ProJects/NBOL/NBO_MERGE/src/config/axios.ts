import OgAxios from "axios";
import { toast } from "sonner";
import { queryClient } from "./query-client";
export const axios = OgAxios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use(function (req) {
  req.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

  return req;
});
axios.interceptors.response.use(
  function (response) {
    if (response.config.method === "get") {
      return response;
    }

    return response;
  },
  (err) => {
    const status = err.response?.status || null;
    if (status && status === 401) {
      toast.info("Your session has expired. Please log in again.");
      localStorage.clear();
      sessionStorage.clear();
      queryClient.removeQueries();
      setTimeout(() => {
        window.location.pathname = "/login";
      }, 2000);
    } else {
      throw err;
    }
  },
);
