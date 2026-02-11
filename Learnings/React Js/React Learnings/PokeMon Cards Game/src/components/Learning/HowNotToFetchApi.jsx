import { useEffect, useState } from "react";
import "../components/pokemon.css";


const API = "https://jsonplaceholder.typicode.com/posts";
export function HowNotToFetchApi() {
  const [api, setApi] = useState([]);
  const [errorHandle, setErrorHandle] = useState(null);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setApi(data))
      .catch((error) => {
        console.log(error);
        setErrorHandle(error);
      });
  },[]);

  if (errorHandle)
    return (
      <>
        <p>Error : {errorHandle.message}</p>
      </>
    );

  return (
    <>
      <div className="container effect-container"></div>
      <ul>
        Name :
        {api.map((item) => {
          return <li key={item.id}>{item.title}</li>;
        })}
      </ul>
    </>
  );
}
