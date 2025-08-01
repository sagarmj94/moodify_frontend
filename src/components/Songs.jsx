import React, { useState } from "react";
import "./Songs.css";

const Songs = ({songs}) => {

  

  return (
    <div className="mood-songs">
      <h2>Recommended Songs</h2>
      {songs.map((song, index) => (
        <div key={index} className="song">
          <div className="title">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
          <div>
            <audio controls={true} src={song.audio}> </audio>
            <i
              className="ri-pause-line"
            ></i>
            <i
              className="ri-play-circle-line"
            ></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Songs;
