import axios from "axios";
export async function QuestionerID() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user) {
      console.log("User not found in localStorage");
      return;
    }
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/cbi/participant-assessment/${
        user?.participant_id
      }/${user?.client_id}/${user?.["participants.cohort_id"]}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// import axios from "axios";
// export async function QuestionerID() {
//   try {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");
//     if (!user) {
//       console.log("USER NOT FOUND IN LOCAL STORAGE")
//     }
//     const url = `${import.meta.env.VITE_API_URL}/cbi/participant-assessment/${
//       user?.participant_id
//     }/${user?.client_id}/${user?.["participants.cohort_id"]}`;
//     const res = await axios.get(url, {
//       header: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log(res);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// }
