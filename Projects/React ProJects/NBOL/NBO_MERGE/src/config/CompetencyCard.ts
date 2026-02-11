import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const CompetencyCard = () => {
  return useQuery({
    queryKey: ["competencyCard"],
    queryFn: async () => {
      const userstring = localStorage.getItem("user");
      const user = JSON.parse(userstring!);

      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/competency/participant-dashboard/${user?.participant_id}/${user?.client_id}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
};
