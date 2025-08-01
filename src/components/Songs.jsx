import React, { useRef } from "react";
import "./Songs.css";

const Songs = ({ songs }) => {
  const currentlyPlayingAudio = useRef(null);

  const handlePlay = (e) => {
    // Pause previously playing audio (if any) before playing new audio
    if (currentlyPlayingAudio.current && currentlyPlayingAudio.current !== e.target) {
      currentlyPlayingAudio.current.pause();
    }
    currentlyPlayingAudio.current = e.target;
  };

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
            <audio
              controls
              src={song.audio}
              onPlay={handlePlay}
            />
            {/* The play/pause icons below can be removed or updated if you want custom controls */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Songs;
