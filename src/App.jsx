import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import YouTube from "react-youtube";

function App() {
  // las constantes con toda la info de la api 
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "5a95864393a02b6e853119ef8574405e";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // endpoint para las imagenes
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  // los estados
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

// El modo stufita
  const [isNightMode, setIsNightMode] = useState(false);

//funcion del modo stufa
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  // funcion para realizar la peticion get a la api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      // me tira el id de la primera peli
      await fetchMovie(results[0].id);
    }
  };

  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // funcion para buscar las pelis
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    
    <div>
      <h1 className="text-center mt-5 mb-5 ">Trailer  Movies</h1>

      {/* futuro modo noche */}
      {/* <button onClick={toggleNightMode}> Modo stufa</button> */}




      {/* input para buscar las pelis  */}
      <form className="container mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>

      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
  videoId={trailer.key}
  className="reproductor container"
  containerClassName={"youtube-container amru"}
  opts={{
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1, // Agrega controles
      cc_load_policy: 0,
      fs: 0,
      iv_load_policy: 0,
      modestbranding: 0,
      rel: 0,
      showinfo: 0,
    },
  }}
/>

                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "No encontre el trailer pa, te pido disculpas"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* contenedor para mostrar las pelis   en la peticion a la api */}
      <div className="container mt-3">
        <div className="row">
        {movies.map((movie) => (
  <div
    key={movie.id}
    className="col-md-4 mb-3"
    onClick={() => selectMovie(movie)}
  >
    <img
      src={`${URL_IMAGE + movie.poster_path}`}
      alt=""
      height={600}
      width="100%"
      className="movie-poster" 
    />
    <h4 className="text-center text-white">{movie.title}</h4>
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default App;


// algun dia si dios quiera la modularizo, hoy no