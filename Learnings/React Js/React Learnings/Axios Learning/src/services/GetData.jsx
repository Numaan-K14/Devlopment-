import axios from "axios";
let api = axios.create({
  baseURL: "https://fakestoreapi.com/",
});
export function GetData() {
  return api.get("products");
}
