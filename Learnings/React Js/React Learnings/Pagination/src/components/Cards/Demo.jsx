import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";

const API = "https://randomuser.me/api/?results=100&page=1";
export function ApiFetching() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const apiFetching = async () => {
      try {
        const response = await fetch(API);
        const data = await response.json();
        console.log(data.results);
        setUser(data.results);
      } catch (error) {
        console.log(error);
      }
    };
    apiFetching();
  }, []);
  return (
    <>
      <ul>
        {user.map((currentData) => (
          <UserCard key={currentData.login.uuid} UserInfo={currentData} />
        ))}
      </ul>
    </>
  );
}
