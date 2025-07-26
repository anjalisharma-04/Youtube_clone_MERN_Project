// frontend/src/components/CustomVideoPlayer.jsx

import React, { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import FastForwardIcon from "@mui/icons-material/FastForward";

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [time, setTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [jumpText, setJumpText] = useState("");
  const [speeding, setSpeeding] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play();
  }, []);

  const togglePlayback = () => {
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  };

  const toggleSound = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const onVolumeChange = (e) => {
    const level = parseFloat(e.target.value);
    videoRef.current.volume = level;
    setVol(level);
    setMuted(level === 0);
  };

  const updateProgress = () => setTime(videoRef.current.currentTime);
  const loadMeta = () => setTotalDuration(videoRef.current.duration);

  const seekTime = (e) => {
    const seekTo = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTo;
    setTime(seekTo);
  };

  const jump = (secs) => {
    videoRef.current.currentTime += secs;
    setJumpText(secs > 0 ? "+10" : "-10");
    setTimeout(() => setJumpText(""), 1000);
  };

  const toggleScreen = () => {
    if (!fullScreen) videoRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setFullScreen(!fullScreen);
  };

  const boostSpeed = () => {
    videoRef.current.playbackRate = 2.0;
    setSpeeding(true);
  };

  const normalizeSpeed = () => {
    videoRef.current.playbackRate = 1.0;
    setSpeeding(false);
  };

  const format = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden"
      onMouseDown={boostSpeed}
      onMouseUp={normalizeSpeed}
      onMouseLeave={normalizeSpeed}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="w-full rounded-lg"
        onTimeUpdate={updateProgress}
        onLoadedMetadata={loadMeta}
      />

      {(jumpText || speeding) && (
        <div className="absolute top-1/2 left-1/2 flex items-center gap-2 text-white text-2xl font-bold transform -translate-x-1/2 -translate-y-1/2">
          {speeding && <FastForwardIcon fontSize="large" />}
          <span>{jumpText}</span>
        </div>
      )}

      <div className="absolute bottom-0 w-full p-3 bg-black/70 rounded-b-lg">
        <div className="flex items-center justify-between gap-4">
          <button onClick={togglePlayback} className="text-white">
            {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          <button onClick={() => jump(-10)} className="text-white">
            <Replay10Icon fontSize="medium" />
          </button>

          <button onClick={() => jump(10)} className="text-white">
            <Forward10Icon fontSize="medium" />
          </button>

          <div className="flex items-center gap-2 flex-grow">
            <span className="text-white text-sm">{format(time)}</span>
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              value={time}
              onChange={seekTime}
              className="flex-grow h-1 rounded-lg accent-red-500"
            />
            <span className="text-white text-sm">{format(totalDuration)}</span>
          </div>

          <div className="flex items-center">
            <button onClick={toggleSound} className="text-white mr-2">
              {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={vol}
              onChange={onVolumeChange}
              className="w-24 h-1 rounded-lg accent-red-500"
            />
          </div>

          <button onClick={toggleScreen} className="text-white">
            {fullScreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
