//WITHOUT SERVICES
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Cards } from "../Components/Cards";
// const API = "https://fakestoreapi.com/products";
// export function StoreData() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function Getstore() {
//       try {
//         const res = await axios.get(API);
//         setData(res.data);
//         console.log(res.data);
//       } catch (error) {
//         console.log("Error Message :", error.message);
//         console.log("Error Status :", error.status);
//       }
//     }
//     Getstore();
//   }, []);

//   return (
//     <div className="grid grid-cols-4 gap-14 bg-gray-300 p-14">
//       {data.map((item) => (
//         <Cards key={item.id} StoreData={item} />
//       ))}
//     </div>
//   );
// }

//USING SERVICES :
import { useEffect, useState } from "react";
import { Cards } from "../Components/Cards";
import { GetData } from "../services/GetData";
export function StoreData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function Getstore() {
      try {
        const res = await GetData();
        setData(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error Message :", error.message);
        console.log("Error Status :", error.status);
      }
    }
    Getstore();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 bg-gray-300 p-14">
      {data.map((item) => (
        <Cards key={item.id} StoreData={item} />
      ))}
    </div>
  );
}
