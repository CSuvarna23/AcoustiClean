import { useMemo, useState as useStateParticles } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
// --- END PARTICLE IMPORTS ---

import React, { useState, useCallback, useRef } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

// --- ICONS ---
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const FlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="13 2 13 9 19 9" />
    <path d="M17 3a2.85 2.85 0 0 1 2 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="15" y1="15" x2="9" y2="15" />
  </svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);
const Spinner = () => (
  <div className="spinner"></div>
);

// --- HELPERS ---
const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return seconds;
  const totalSeconds = Math.floor(seconds);
  const milliseconds = Math.round((seconds - totalSeconds) * 100);
  const minutes = Math.floor(totalSeconds / 60);
  const secStr = String(totalSeconds % 60).padStart(2, '0');
  const minStr = String(minutes).padStart(2, '0');
  const msStr = String(milliseconds).padStart(2, '0');
  return `${minStr}:${secStr}.${msStr}`;
};






// --- APP ---
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processingMode, setProcessingMode] = useState('noise_removal');
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numSpeakers, setNumSpeakers] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAudios, setSelectedAudios] = useState([]);
  const [mergedAudioPath, setMergedAudioPath] = useState(null);
  const audioRef = useRef(null);

  // --- particles: prepare an init callback to load the slim bundle ---
  const particlesInit = async (engine) => {
    // loadSlim will register the necessary particle shapes/interactors on the engine
    await loadSlim(engine);
    // no need to set extra state; Particles will render normally
  };

  const particlesLoaded = (container) => {
    // optional: inspect container
    // console.log("Particles container loaded", container);
  };

  const options = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.12, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1.2, straight: false },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.28 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  }), []);

  // --- file handling + audio controls ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError(null);
    setOutput(null);
    setIsPlaying(false);
    setSelectedAudios([]);
    setMergedAudioPath(null);
    if (audioRef.current && file) {
      audioRef.current.src = URL.createObjectURL(file);
    }
  };

  const handleModeChange = (event) => {
    setProcessingMode(event.target.value);
    setOutput(null);
    setError(null);
    setSelectedAudios([]);
    setMergedAudioPath(null);
  };

  const handlePlayPauseUploadedAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearResults = () => {
    setOutput(null);
    setError(null);
    setSelectedFile(null);
    setIsPlaying(false);
    setSelectedAudios([]);
    setMergedAudioPath(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  React.useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      const onEnded = () => setIsPlaying(false);
      const onPause = () => setIsPlaying(false);
      const onPlay = () => setIsPlaying(true);
      audioEl.addEventListener('ended', onEnded);
      audioEl.addEventListener('pause', onPause);
      audioEl.addEventListener('play', onPlay);
      return () => {
        audioEl.removeEventListener('ended', onEnded);
        audioEl.removeEventListener('pause', onPause);
        audioEl.removeEventListener('play', onPlay);
      };
    }
  }, []);

  const handleProcess = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an audio file first.");
      return;
    }
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size too large. Please select a file smaller than 50MB.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput(null);
    setSelectedAudios([]);
    setMergedAudioPath(null);
    const formData = new FormData();
    formData.append('audio_file', selectedFile);
    formData.append('processing_mode', processingMode);
    if (processingMode === 'sound_separation') {
      formData.append('num_speakers', numSpeakers);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setOutput(result.data);
      } else {
        throw new Error(result.detail || "Processing failed");
      }
    } catch (err) {
      setError(err.message || "Processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, processingMode, numSpeakers, isPlaying]);

  const toggleAudioSelection = useCallback((filename) => {
    setSelectedAudios(prev =>
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  }, []);

  const handleMergeSelected = useCallback(async () => {
    if (selectedAudios.length < 2) return;
    setMergedAudioPath(null);
    const filesOnly = selectedAudios.map(path => (path.startsWith('/') ? path.split('/').pop() : path));
    try {
      const response = await fetch(`${API_BASE_URL}/merge_audios`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filesOnly),
      });
      const result = await response.json();
      if (result.success) setMergedAudioPath(`${API_BASE_URL}${result.download_path}`);
      else alert("Merge failed. Try again.");
    } catch {
      alert("Merge failed");
    }
  }, [selectedAudios]);

  const renderOutput = useCallback(() => {
    if (error) return <div className="output-error">Error: {error}</div>;
    if (!output) return <p className="output-message">Select a processing mode and process a file to see the output.</p>;
    const mode = output.type;
    switch (mode) {
      case 'download': {
        const downloadLink = `${API_BASE_URL}/download_temp/${output.output_filename}`;
        return (
          <div className="output-file-result">
            <p className="success-message">✅ Noise Removal Completed</p>
            <div className="file-info"><span className="file-name">Output File: {output.output_filename}</span></div>
            <div className="actions">
              <a href={downloadLink} download className="download-link"><DownloadIcon />Download Denoised Audio</a>
            </div>
            <audio controls style={{ width: '100%', marginTop: '15px' }} src={downloadLink}>Your browser does not support the audio element.</audio>
          </div>
        );
      }
      case 'text_only':
        return (
          <div className="output-transcription">
            <p className="success-message">✅ Transcription Complete</p>
            <div className="transcription-content">
              <p className="transcription-label">Transcription:</p>
              <p className="transcription-text">{output.transcription}</p>
            </div>
          </div>
        );
      case 'directory_output':
        return (
          <div className="output-complex">
            <p className="success-message">✅ Separation Complete (Vocals & Non-Vocals)</p>
            <div className="stems-section">
              <p className="stems-label">Download Separated Audio:</p>
              <div className="stems-list">
                {output.stems && output.stems.map((stem, index) => (
                  <div key={index} className="stem-item">
                    <div className="stem-info">
                      <span className="stem-name">{stem.display_name || stem.name}</span>
                      <a href={`${API_BASE_URL}${stem.download_path}`} download className="stem-download-link"><DownloadIcon />Download</a>
                    </div>
                    <audio controls style={{ width: '100%', marginTop: '10px' }} src={`${API_BASE_URL}${stem.download_path}`}>Your browser does not support the audio element.</audio>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'complex_output': {
        return (
          <div className="output-complex">
    
            <div className="stems-section">
              <p className="stems-label">Download Separated Stems:</p>
              <div className="stems-list">
                {output.stems && output.stems.map((stem, index) => {
                  const fname = stem.download_path.split('/').pop();
                  const selected = selectedAudios.includes(fname);
                  return (
                    <div key={index} className={`stem-item${selected ? " selected-stem" : ""}`}>
                      <div className="stem-info">
                        <span className="stem-name">{stem.display_name || stem.name}</span>
                        <a href={`${API_BASE_URL}${stem.download_path}`} download className="stem-download-link">
                          <DownloadIcon />Download
                        </a>
                        <button type="button" className={`select-audio-btn${selected ? " selected" : ""}`} onClick={() => toggleAudioSelection(fname)}>
                          {selected ? '✓ Selected' : '+ Select'}
                        </button>
                      </div>
                      <audio controls style={{ width: '100%', marginTop: '10px' }} src={`${API_BASE_URL}${stem.download_path}`}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  );
                })}
              </div>
            </div>
            {output.transcription && output.transcription.length > 0 && (
              <div className="transcription-section">
                <p className="stems-label">Speaker Diarization Results ({numSpeakers} Speakers):</p>
                <div className="stems-list">
                  {output.transcription.map((item, idx) => {
                    const fname = item.audio_download_path.split('/').pop();
                    const selected = selectedAudios.includes(fname);
                    return (
                      <div key={idx} className={`stem-item${selected ? " selected-stem" : ""}`}>
                        <div className="stem-info" style={{ marginBottom: '5px' }}>
                          <span className="stem-name">
                            <strong>Speaker {item.speaker}:</strong>
                            <span className="duration" style={{ marginLeft: '10px' }}>({formatDuration(item.duration)})</span>
                          </span>
                          <a href={`${API_BASE_URL}${item.audio_download_path}`} download={`Speaker_${item.speaker}_Audio.wav`} className="stem-download-link" style={{ backgroundColor: '#007bff' }}>
                            <DownloadIcon /> Download Speaker {item.speaker} Audio
                          </a>
                          <button type="button" className={`select-audio-btn${selected ? " selected" : ""}`} onClick={() => toggleAudioSelection(fname)}>
                            {selected ? '✓ Selected' : '+ Select'}
                          </button>
                        </div>
                        <p className="transcription-text" style={{ margin: '0 0 10px 0', paddingLeft: '0' }}>{item.text}</p>
                        <audio controls style={{ width: '100%', marginTop: '5px' }} src={`${API_BASE_URL}${item.audio_download_path}`}>Your browser does not support the audio element.</audio>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {selectedAudios.length > 1 && (
              <div className="merge-actions" style={{ marginTop: "20px", textAlign: "center" }}>
                <button className="process-btn" style={{ maxWidth: 400, margin: "auto" }} onClick={handleMergeSelected} type="button">
                  Merge Selected Audios
                </button>
              </div>
            )}
            {mergedAudioPath && (
              <div className="output-file-result" style={{ marginTop: 20, textAlign: "center" }}>
                <p className="success-message">🎉 Merged Output Ready</p>
                <a href={mergedAudioPath} download="Final_Merged_Output.wav" className="download-link"><DownloadIcon /> Download Final Output</a>
                <audio controls style={{ width: '100%', marginTop: '10px' }} src={mergedAudioPath}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        );
      }
      default: return <p className="output-message">Unknown output type</p>;
    }
  }, [output, error, numSpeakers, selectedAudios, mergedAudioPath, toggleAudioSelection, handleMergeSelected]);

  const emojis = ["🎵", "🎶", "🎧", "🎤","🎙️","🎼","🔊","🎵","🎙️","🎼","🔊","🎧", "🎤", "🎹", "🎸","🎙️","🎼"];

  return (
    <div className="app-wrapper">
      {/* Gradient background */}
      <div className="gradient-bg"></div>

      {/* Floating emojis */}
      <div className="particles-bg">
        {emojis.map((emoji, i) => (
          <span
            key={i}
            className="floating-emoji"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* tsparticles instance (init prop loads slim bundle) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
        className="particles-bg"
      />

      <div className="container">
        <h1 className="title">AcoustiClean</h1>
        <p className="subtitle">AI-Driven Audio Processing</p>
        <form onSubmit={handleProcess}>
          <div className="file-input-group">
            <label htmlFor="audio-upload" className="choose-file-btn">Choose Audio File</label>
            <input id="audio-upload" type="file" accept=".wav,.mp3" onChange={handleFileChange} style={{ display: 'none' }} />
            <div className="file-name-display">{selectedFile ? selectedFile.name : "Select .wav or .mp3 audio file"}</div>
            {selectedFile && (
              <>
                <button type="button" onClick={handlePlayPauseUploadedAudio} className="choose-file-btn" style={{ backgroundColor: isPlaying ? '#ffc107' : '#17a2b8', color: isPlaying ? '#333' : 'white' }}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />} {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button type="button" onClick={clearResults} className="clear-btn">Clear</button>
              </>
            )}
          </div>
          <audio ref={audioRef} style={{ display: 'none' }} />
          <h3 className="mode-heading">Processing Mode</h3>
          <div className="options-grid">
            <label className={`radio-card ${processingMode === 'noise_removal' ? 'selected' : ''}`}>
              <input type="radio" name="processing_mode" value="noise_removal" checked={processingMode === 'noise_removal'} onChange={handleModeChange} />
              Noise Removal
            </label>
            <label className={`radio-card ${processingMode === 'vocals_non_vocals' ? 'selected' : ''}`}>
              <input type="radio" name="processing_mode" value="vocals_non_vocals" checked={processingMode === 'vocals_non_vocals'} onChange={handleModeChange} />
              Vocals/Non-Vocals
            </label>
            <label className={`radio-card ${processingMode === 'sound_separation' ? 'selected' : ''}`}>
              <input type="radio" name="processing_mode" value="sound_separation" checked={processingMode === 'sound_separation'} onChange={handleModeChange} />
              Full Separation + Diarization
            </label>
            <label className={`radio-card ${processingMode === 'transcription' ? 'selected' : ''}`}>
              <input type="radio" name="processing_mode" value="transcription" checked={processingMode === 'transcription'} onChange={handleModeChange} />
              Transcription
            </label>
          </div>
          {processingMode === 'sound_separation' && (
            <div className="speaker-input">
              <label>Number of Speakers:</label>
              <input type="number" min="1" max="10" value={numSpeakers} onChange={(e) => setNumSpeakers(parseInt(e.target.value))} />
            </div>
          )}
          <button type="submit" className="process-btn" disabled={isLoading || !selectedFile}>
            {isLoading ? (<><Spinner />Processing...</>) : (<><FlashIcon />Process Audio</>)}
          </button>
        </form>

        <div className="output-section">
          <h3>Output</h3>
          <div className="output-box">{renderOutput()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;