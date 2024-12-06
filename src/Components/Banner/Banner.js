import React, { useEffect, useState } from "react";
import { API_KEY, imageUrl } from "../../constants/constants";
import "./Banner.css";
import axios from "../../axios";

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 19));
}

function Banner() {
  const [movie, setMovie] = useState();
  const [trailerKey, setTrailerKey] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [myList, setMyList] = useState(() => {
    // Load My List from local storage on initial load
    const savedList = localStorage.getItem("myList");
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`
      )
      .then((response) => {
        const randomMovie = response.data.results[getRandomInt(1)];
        setMovie(randomMovie);

        // Fetch the trailer for the selected movie
        if (randomMovie) {
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${API_KEY}&language=en-US`
            )
            .then((videoResponse) => {
              const trailer = videoResponse.data.results.find(
                (vid) => vid.type === "Trailer"
              );
              setTrailerKey(trailer ? trailer.key : "");
            });
        }
      });
  }, []);

  const handlePlay = () => {
    if (trailerKey) {
      setShowTrailer(true); // Show trailer iframe
    } else {
      alert("Trailer not available");
    }
  };

  const handleAddToList = () => {
    if (movie) {
      const isAlreadyInList = myList.some((item) => item.id === movie.id);
      if (isAlreadyInList) {
        alert("This movie is already in your list.");
      } else {
        const updatedList = [...myList, movie];
        setMyList(updatedList);
        localStorage.setItem("myList", JSON.stringify(updatedList)); // Save to local storage
        alert(`${movie.title || movie.name} has been added to your list.`);
      }
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false); // Hide trailer iframe
  };

  return (
    <div
      style={{
        backgroundImage: `url(${movie ? imageUrl + movie.backdrop_path : ""})`,
      }}
      className="banner"
    >
      <div className="content">
        <h1 className="title">{movie ? movie.title || movie.name : ""}</h1>
        <div className="banner_buttons">
          <button className="button" onClick={handlePlay}>
            Play
          </button>
          <button className="button" onClick={handleAddToList}>
            My List
          </button>
        </div>
        <h1 className="description">{movie ? movie.overview : ""}</h1>
      </div>

      {/* Trailer Section */}
      {showTrailer && (
        <div className="trailer_container">
          <iframe
            width="100%"
            height="500px"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="YouTube trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
          <button className="close_button" onClick={handleCloseTrailer}>
            Close
          </button>
        </div>
      )}

      <div className="fade"></div>
    </div>
  );
}

export default Banner;
