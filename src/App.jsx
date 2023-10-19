import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./App.css";

function App() {
  //todo lo de la API
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "5a95864393a02b6e853119ef8574405e";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  //estados
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ tittle: "Loading movies" });
  const [playing, setPlaying] = useState(false);

  //funcion para hacer la peticion por get  a la API
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
  };
// funcion para la peticion de un solo objeto y mostrar en el reproductor
  const fetchMovie = async(id) => {
    const{data} = await axios.get(`${API_URL}/movie/${id}`,{
      paramas:{
        api_key: API_KEY,
        append_to_response:"videos"
      }
    })
    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        //si existe un offial trailer lo muestra 
        (vid) => vid.name === "Official trailer"
      )
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
  }




  //funcion para buscar las peli

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        {/* agregar modo oscuro */}
        {/* <button className="btn rounded-fill"><i className="bi bi-moon-fill"></i></button> */}
        <h2 className="text-center mt-5 mb-5">Trailer Movies</h2>
        {/* buscador de peli  */}

        <form className="container mb-4 d-flex" onSubmit={searchMovies}>
          <input
            className="form-control col-auto"
            type="text"
            placeholder="Search movie"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="btn btn-primary col-auto" type="submit">
            Search
          </button>
        </form>

        {/* div que muestra los poster de las pelis */}
        <div className="container mt-3">
          <div className="row">
            {movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-3">
                <img
                  src={`${URL_IMAGE + movie.poster_path}`}
                  alt=""
                  height={600}
                  width="100%"
                />
                <h4 className="text-center">{movie.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
}

export default App;
