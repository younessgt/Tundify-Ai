import { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

export default function AudioPlayer({ audioFileURL, senderIsMe }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  //   const [waveform, setWaveform] = useState(null);

  const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: "#ccc",
    progressColor: "#8696a0",
    cursorColor: "transparent",
    barWidth: 2,
    barRadius: 3,
    responsive: true,
    height: 40,
    normalize: true,
    backend: "WebAudio",
    // partialRender: true,
  });

  const formatTime = (seconds) => {
    let date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  // init wavesurfer and set up event listners
  useEffect(() => {
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(audioFileURL);

    wavesurfer.current.on("ready", function () {
      setDuration(wavesurfer.current.getDuration());
    });

    // update curent time on audio time change
    wavesurfer.current.on("audioprocess", function () {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    return () => {
      wavesurfer.current.un("ready");
      wavesurfer.current.un("audioprocess");
      wavesurfer.current.destroy();
    };
  }, [audioFileURL]);

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
    wavesurfer.current.playPause();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between w-full gap-x-2">
        <div className="flex items-center">
          <button onClick={handlePlayPause}>
            {!playing ? <FaPlay /> : <FaPause />}
          </button>
        </div>
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div ref={waveformRef} style={{ width: "160px" }}></div>
      </div>
    </div>
  );
}
