import React, { useEffect, useState } from 'react';
import YouTube from "react-youtube";
import "./RowPost.css";
import axios from '../../axios';
import { imageUrl, API_KEY } from '../../constants/constants';

function RowPost(props) {
  const [movie, setMovie] = useState([]);
  const [urlId, setUrlId] = useState('');
  
  useEffect(() => {
    axios.get(props.url).then((response) => {
      console.log(response.data);
      setMovie(response.data.results);
    });
  }, [props.url]);
  
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleMovie = (id) => {
    console.log(id);
    axios.get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((response) => {
        if (response.data.results.length !== 0) {
          setUrlId(response.data.results[0].key);
        } else {
          console.log('No trailer');
        }
      })
      .catch(error => console.error(error));
  };

  const closeVideo = () => {
    setUrlId(''); // Clear the video ID to close the YouTube video
  };

  return (
    <div className='row'>
      <h2 className='titles'>{props.title}</h2>
      <div className='posters'>
        {movie.map((obj) => (
          <img 
            onClick={() => handleMovie(obj.id)} 
            className={props.isSmall ? 'smallPoster' : 'poster'} 
            src={`${imageUrl + obj.backdrop_path}`} 
            alt={obj.title || "Movie poster"} 
            key={obj.id}
          />
        ))}
      </div>
      {urlId && (
        <div className='videoContainer'>
          <button className='closeButton' onClick={closeVideo}>Close</button>
          <YouTube opts={opts} videoId={urlId} />
        </div>
      )}
    </div>
  );
}

export default RowPost;
