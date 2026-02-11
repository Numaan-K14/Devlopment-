import axios from "axios";
export const CompetencyCard = async () => {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = localStorage.getItem("token");
    let url = `${
      import.meta.env.VITE_API_URL
    }/competency/participant-dashboard/${user?.participant_id}/${
      user?.client_id
    }`;
    let res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("CompetencyCard Error:", error);
    throw error;
  }
};
