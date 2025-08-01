// src/components/FaceDetect.js

import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css";
import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;



const FacialExpression = ({ setSongs }) => {
  const videoRef = useRef();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [mood, setMood] = useState("");
  const [error, setError] = useState("");
  const [detectedMood, setDetectedMood] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [lookAtCamera, setLookAtCamera] = useState('');
  const fileInputRef = useRef(null);

  // Load face-api models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    startVideo();
  };

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
  };



  // detect mood handler
  const detectMood = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      console.log("No face detected");
      setLookAtCamera("Please look at the camera");
      return;
    }

    const expressions = detections[0].expressions;
    let maxConfidence = 0;
    let mood = "";

    for (const [expression, confidence] of Object.entries(expressions)) {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        mood = expression;
      }
    }
    // Fetch songs based on detected mood get api
    axios
      .get(`${BASE_URL}/songs?mood=${mood}`)
      .then((response) => {
        console.log("Songs fetched:", response.data.songs);
        setSongs(response.data.songs);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
      });
    if (mood) {
      console.log("Detected mood:", mood, "Confidence:", maxConfidence);
      console.log(`Detected mood: ${mood}`);
      setDetectedMood(mood);
    }
  };

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form handle data
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validation
    if (!title || !artist || !audio || !mood) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);
    formData.append("mood", mood);
    setIsUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/songs`, formData);
      console.log("Uploaded song:", response.data.song);
      setTitle("");
      setArtist("");
      setAudio(null);
      setMood("");
      setError("");
      fileInputRef.current.value = null;
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload song. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mood-element">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="user-video-feed"
      />
      {detectedMood && (
        <p className="mood-display">Your Mood: <strong>{detectedMood.toUpperCase()}</strong></p>
      )}
      {!detectedMood && lookAtCamera && (
        <p className="look-at-camera">{lookAtCamera}</p>
      )}

      <button onClick={detectMood} className="detect-btn">
        Detect
      </button>

      <h2>Upload a Song</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artist Name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <select value={mood} onChange={(e) => setMood(e.target.value)} required>
          <option value="">Select Mood</option>
          <option value="angry">Angry</option>
          <option value="sad">Sad</option>
          <option value="happy">Happy</option>
          <option value="neutral">Neutral</option>
          <option value="fearful">Fearful</option>
          <option value="surprised">Surprised</option>
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          required
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FacialExpression;
