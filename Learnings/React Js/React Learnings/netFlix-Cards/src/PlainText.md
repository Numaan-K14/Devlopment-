
export const NetflixSeries = () => {
  const name = "Free Coding";
  const returnGenre = () => {
    const genre = "High Paying Jobs";
    return genre;
  };

  // let age = 19;
  // let CanWatch = "NOT AVAILABLE";
  // if (age >= 18) {
  //    CanWatch = "WATCH NOW";
  // };  1)method for conditional Operator
  let age = 19;
  const CanWatch = () => {
    if (age >= 18) return "WATCH NOW ";
    else {
      return "NOT AVAILABLE";
    }
  }; //2)method for conditional Operator

  return (
    <>
      <div>
        <img
          src="code.jpg"
          alt="Code demo"
          style={{ height: "40%", width: "40%" }}
        />
      </div>
      <h2>Name: {name}</h2>
      <h3>Ratings: {5 + 3.7}</h3>
      <p>
        Web design demo coding involves creating a small, sample website using
        HTML for structure, CSS for styling, and JavaScript for interactivity.
        It's typically simple and showcases how these technologies work together
        to build responsive and visually appealing web pages.
      </p>
      <p>Genre : {returnGenre()}</p>
      <button>{CanWatch()}</button>

      {/* <button>{age >= 18 ? "WATCH NOW" : "NOT AVAILABLE" }</button> 
      3)method for conditional Operator*/}
      {/* <button>{ CanWatch}</button> */}
    </>
  );
};

export default NetflixSeries;

-----------------------------------
`export default NetflixSeries;`
 :iska matlab hai tum apne NetflixSeries ko access dere hao ki ise koi bhi call kar sakta hai 

------------------------------------------------

agar app chahate ho ki apko sirf function ka naam pass krna hai 

` export default NetflixSeries ` iski koi jaroorta nhi hai.
 
Bass apko naam import karte waqt { } lagane hoge .

Import name must be match export names exactly.
Agar tum ek hi page pr 2,3 component bana rahe ho to { } iski bahot jarurat hai 


`import NetflixSeries, {Footer,Header} from "./components/NetflixSeries" `
without curly braces waaale export default hai isiliye {} ke bahar aur jo andar hai wo naming conventions haii, isiliye upar ki line aisi likhi gayi hai 
--------------------------------------------------------------------
NetflixSeries.jsx:

//THIS FILE CREATED BY MYSELF FOR COMPONENTS:

export const NetflixSeries = () => {
  const name = "Free Coding";
  const returnGenre = () => {
    const genre = "High Paying Jobs";
    return genre;
  };

  let age = 18;
  const CanWatch = () => {
    if (age >= 18) return "WATCH NOW ";
    else {
      return "NOT AVAILABLE";
    }
  }; 

  return (
    <>
      <div>
        <img
          src="code.jpg"
          alt="Code demo"
          style={{ height: "40%", width: "40%" }}
        />
      </div>
      <h2>Name: {name}</h2>
      <h3>Ratings: {5 + 3.7}</h3>
      <p>
        Web design demo coding involves creating a small, sample website using
        HTML for structure, CSS for styling, and JavaScript for interactivity.
        It's typically simple and showcases how these technologies work together
        to build responsive and visually appealing web pages.
      </p>
      <p>Genre : {returnGenre()}</p>
      <button>{CanWatch()}</button>
    </>
  );
};


export default NetflixSeries;

export const Footer = () => {
    return (
      <>
        <footer>Numaan Kazi @All Copy Right Reserved</footer>
      </>
    );
};
export const Header = () => {
    return (
      <>
        <header>Hello</header>
      </>
    );
};
----------------------------------------------------------------------------
calling API and write using map method 

//THIS FILE CREATED BY MYSELF FOR COMPONENTS:

import seriesData from "../api/seriesData.json";

export const NetflixSeries = () => {
  return (
    <>
      {seriesData.map((item) => {
        console.log(item, ">>>>>Item");
        return (
          <div key={item.name}>
            <div>
              <img
                src={item.img_url}
                alt="Code demo"
                style={{ height: "40%", width: "40%" }}
              />
            </div>
            <h2>Name: {item.name}</h2>
            <h3>Ratings: {item.rating}</h3>
            <p>Description: {item.description}</p>
            <p>Genre: {item.genre}</p>
            <p>Cast: {item.cast}</p>
            <a href={item.watch_url}>
              <button>Watch Now</button>
            </a>
          </div>
        );
      })}
    </>
  );
};

export default NetflixSeries;
-----------------------------------------------------------------------------------------
using indexing method 
import seriesData from "../api/seriesData.json";

export const NetflixSeries = () => {
  return (
    <>
      <div>
        <img
          src={seriesData[0].img_url}
          alt="Code demo"
          style={{ height: "40%", width: "40%" }}
        />
      </div>
      <h2>Name: {seriesData[0].name}</h2>
      <h3>Ratings: {seriesData[0].rating}</h3>
      <p>Description: {seriesData[0].description}</p>
      <p>Genre: {seriesData[0].genre}</p>
      <p>Cast: {seriesData[0].cast}</p>
      <a href={seriesData[0].watch_url} target="_blank" rel="noreferrer">
        <button>Watch Now</button>
      </a>
    </>
  );
};

export default NetflixSeries;
--------------------------------------------------------------------------------------------
making 2 seperate files name as a Cards.jsx in write my jsx here 

export const Cards = (props) => { //Taking arguements as a name of props its a nothing but props 
  return (
    <>
      <div>
        <img
          src={props.item.img_url}
          alt={props.item.id}
          style={{ height: "40%", width: "40%" }}
        />
      </div>
      <h2>Name: {props.item.name}</h2>
      <h3>Ratings: {props.item.rating}</h3>
      <p>Description: {props.item.description}</p>
      <p>Genre: {props.item.genre}</p>
      <p>Cast: {props.item.cast}</p>
      <a href={props.item.watch_url} target="_blank" rel="no referrer">
        <button>Watch Now</button>
      </a>
    </>
  );
};
--------------------------------------------------------------------------------------

[
  {
    "name": "All of Us Are Dead",
    "id": "all-of-us-are-dead",
    "img_url": "http://localhost:5173/images/aouad.jpg",
    "rating": "7.6",
    "description": "Trapped students must escape their high school which has become ground zero for a zombie virus outbreak.",
    "cast": ["Park Ji-hu", "Yoon Chan-young", "Cho Yi-hyun"],
    "genre": ["Horror", "Thriller", "Drama"],
    "watch_url": "https://www.netflix.com/title/81237994"
  },
  {
    "name": "Sweet Home",
    "id": "sweet-home",
    "img_url": "http://localhost:5173/images/sweethome.jpg",
    "rating": "8.0",
    "description": "As humans turn into savage monsters, one troubled teenager and his neighbors fight to survive.",
    "cast": ["Song Kang", "Lee Jin-wook", "Lee Si-young"],
    "genre": ["Horror", "Action", "Fantasy"],
    "watch_url": "https://www.netflix.com/title/81061734"
  },
  {
    "name": "Vincenzo",
    "id": "vincenzo",
    "img_url": "http://localhost:5173/images/vincenzo.jpg",
    "rating": "8.5",
    "description": "At the age of eight, Park Joo-hyung went to Italy after being adopted. He later joins the mafia and returns to Korea.",
    "cast": ["Song Joong-ki", "Jeon Yeo-been", "Ok Taec-yeon"],
    "genre": ["Crime", "Comedy", "Drama"],
    "watch_url": "https://www.netflix.com/title/81365087"
  },
  {
    "name": "Alice in Borderland",
    "id": "alice-in-borderland",
    "img_url": "http://localhost:5173/images/aib.jpg",
    "rating": "8.2",
    "description": "Arisu and his friends find themselves in a deserted Tokyo where they must compete in dangerous games to survive.",
    "cast": ["Kento Yamazaki", "Tao Tsuchiya", "Nijiro Murakami"],
    "genre": ["Action", "Mystery", "Sci-Fi"],
    "watch_url": "https://www.netflix.com/title/80200575"
  },
  {
    "name": "Hellbound",
    "id": "hellbound",
    "img_url": "http://localhost:5173/images/hellbound.jpg",
    "rating": "6.7",
    "description": "People hear predictions on when they will die. When that time comes, a death angel appears and kills them.",
    "cast": ["Yoo Ah-in", "Kim Hyun-joo", "Park Jeong-min"],
    "genre": ["Horror", "Fantasy", "Thriller"],
    "watch_url": "https://www.netflix.com/title/81256675"
  },
  {
    "name": "Kingdom",
    "id": "kingdom",
    "img_url": "http://localhost:5173/images/kingdom.jpg",
    "rating": "8.3",
    "description": "In a kingdom defeated by corruption and famine, a mysterious plague spreads turning people into zombies.",
    "cast": ["Ju Ji-hoon", "Bae Doona", "Kim Sung-kyu"],
    "genre": ["Action", "Horror", "Thriller"],
    "watch_url": "https://www.netflix.com/title/80180171"
  },
  {
    "name": "Hospital Playlist",
    "id": "hospital-playlist",
    "img_url": "http://localhost:5173/images/hp.jpg",
    "rating": "9.1",
    "description": "Five doctors who have been friends since medical school share the ups and downs of working at the same hospital.",
    "cast": ["Jo Jung-suk", "Yoo Yeon-seok", "Jung Kyung-ho"],
    "genre": ["Comedy", "Drama"],
    "watch_url": "https://www.netflix.com/title/81239224"
  },
  {
    "name": "Start-Up",
    "id": "start-up",
    "img_url": "http://localhost:5173/images/startup.jpg",
    "rating": "8.0",
    "description": "Young entrepreneurs aspire to launch virtual dreams into reality while navigating challenges and romance.",
    "cast": ["Bae Suzy", "Nam Joo-hyuk", "Kim Seon-ho"],
    "genre": ["Drama", "Romance"],
    "watch_url": "https://www.netflix.com/title/81290293"
  },
  {
    "name": "Crash Landing on You",
    "id": "crash-landing-on-you",
    "img_url": "http://localhost:5173/images/cloy.jpg",
    "rating": "9.0",
    "description": "A South Korean heiress accidentally crash lands in North Korea and meets an army officer who helps her hide.",
    "cast": ["Hyun Bin", "Son Ye-jin", "Seo Ji-hye"],
    "genre": ["Comedy", "Romance", "Drama"],
    "watch_url": "https://www.netflix.com/title/81159258"
  },
  {
    "name": "It's Okay to Not Be Okay",
    "id": "its-okay-to-not-be-okay",
    "img_url": "http://localhost:5173/images/iotnbo.jpg",
    "rating": "8.6",
    "description": "An antisocial children's book author and a psych ward caretaker help each other heal from emotional wounds.",
    "cast": ["Kim Soo-hyun", "Seo Ye-ji", "Oh Jung-se"],
    "genre": ["Drama", "Romance", "Fantasy"],
    "watch_url": "https://www.netflix.com/title/81243992"
  }
]

-------------------------------------------

// [
//   {
//     "name": "Lovely Runner",
//     "id": "lovely-runner",
//     "img_url": "http://localhost:5173/images/lr.webp",
//     "rating": "9.8",
//     "description": "Im Sol travels back in time to prevent the tragic fate of her favorite star, Ryu Sun Jae.",
//     "cast": ["Kim Hye Yoon", "Byeon Woo Seok", "Song Geon Hee"],
//     "genre": ["Romantic Comedy", "Fantasy"],
//     "watch_url": "https://www.viki.com/tv/40466c-lovely-runner"
//   },
//   {
//     "name": "Stranger Things",
//     "id": "stranger-things",
//     "img_url": "http://localhost:5173/images/st.jpg",
//     "rating": "8.7",
//     "description": "A group of young friends witness supernatural forces and secret government exploits.",
//     "cast": ["Winona Ryder", "David Harbour", "Millie Bobby Brown"],
//     "genre": ["Drama", "Fantasy", "Horror"],
//     "watch_url": "https://www.netflix.com/title/80057281"
    
//   },
//   {
//     "name": "The Witcher",
//     "id": "the-witcher",
//     "img_url": "http://localhost:5173/images/tw.webp",
//     "rating": "8.2",
//     "description": "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world.",
//     "cast": ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
//     "genre": ["Action", "Adventure", "Drama"],
//     "watch_url": "https://www.netflix.com/title/80189685"
//   },
//   {
//     "name": "Money Heist",
//     "id": "money-heist",
//     "img_url": "http://localhost:5173/images/mh.jpg",
//     "rating": "8.3",
//     "description": "A criminal mastermind who goes by 'The Professor' plans the biggest heist in recorded history.",
//     "cast": ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"],
//     "genre": ["Action", "Crime", "Drama"],
//     "watch_url": "https://www.netflix.com/title/80192098"
//   },
//   {
//     "name": "The Crown",
//     "id": "the-crown",
//     "img_url": "http://localhost:5173/images/tc.webp",
//     "rating": "8.6",
//     "description": "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
//     "cast": ["Claire Foy", "Olivia Colman", "Imelda Staunton"],
//     "genre": ["Biography", "Drama", "History"],
//     "watch_url": "https://www.netflix.com/title/80025678"
//   },
//   {
//     "name": "Squid Game",
//     "id": "squid-game",
//     "img_url": "http://localhost:5173/images/sg.webp",
//     "rating": "8.1",
//     "description": "Hundreds of cash-strapped contestants accept an invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
//     "cast": ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon"],
//     "genre": ["Action", "Drama", "Mystery"],
//     "watch_url": "https://www.netflix.com/title/81040344"
//   },
//   {
//     "name": "All of Us Are Dead",
//     "id": "all-of-us-are-dead",
//     "img_url": "http://localhost:5173/images/dead.jpg",
//     "rating": "7.6",
//     "description": "Trapped students must escape their high school which has become ground zero for a zombie virus outbreak.",
//     "cast": ["Park Ji-hu", "Yoon Chan-young", "Cho Yi-hyun"],
//     "genre": ["Horror", "Thriller", "Drama"],
//     "watch_url": "https://www.netflix.com/title/81237994"
//   },
//   {
//     "name": "Queen of Tears",
//     "id": "queen-of-tears",
//     "img_url": "http://localhost:5173/images/qot.jpg",
//     "rating": "TBD",
//     "description": "A gripping tale of love, loss, and resilience set against the backdrop of a war-torn nation.",
//     "cast": ["Kim Soo Hyun", "Kim Ji Won"],
//     "genre": ["Drama", "Romance"],
//     "watch_url": "https://www.viki.com/tv/23456789c-queen-of-tears"
//   }
// ]
---------------------------------------------------------------------------------------------
(passing props but not destructuring)
export const Cards = (props) => {
  //Taking arguements as a name of props its a nothing but props
  return (
    <>
      <div>
        <img
          src={props.item.img_url}
          alt={props.item.id}
          style={{ height: "40%", width: "40%" }}
        />
      </div>
      <h2>Name: {props.item.name}</h2>
      <h3>Ratings: {props.item.rating}</h3>
      <p>Description: {props.item.description}</p>
      <p>Genre: {props.item.genre}</p>
      <p>Cast: {props.item.cast}</p>
      <a href={props.item.watch_url}  rel="no referrer" target="_blank">
        <button>Watch Now</button>
      </a>
    </>
  );
};

---------------------------------------------------------------------------------------------
