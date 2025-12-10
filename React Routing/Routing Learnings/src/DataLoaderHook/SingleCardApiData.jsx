//Params is nothing but react router hook and this not props but this is simple method to

export async function SingleCardApiData({ params }) {
  const id = params.MoviesID;

  const API = `https://www.omdbapi.com/?i=${id}&apikey=${
    import.meta.env.VITE_SOME_KEY
  }`;
  try {
    // await new Promise((abc) => setTimeout(abc, 100)); //this line add some extra delay.
    const response = await fetch(API);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
