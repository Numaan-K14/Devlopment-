const API = `https://www.omdbapi.com/?s=titanic&apikey=${
  import.meta.env.VITE_SOME_KEY
}&page=1`;

export async function ApiData() {
  try {
    // await new Promise((abc) => setTimeout(abc, 100)); //this line add some extra delay.
    const response = await fetch(API);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
