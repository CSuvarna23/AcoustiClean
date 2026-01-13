#processor.py

import os
import subprocess
import warnings
import sys
import shutil
import librosa
import soundfile as sf
import noisereduce as nr
import torch
import torchaudio
import numpy as np
from scipy.signal import medfilt
from pydub import AudioSegment
from pyannote.audio import Pipeline
import whisper
import tempfile
from pathlib import Path
import glob

warnings.filterwarnings("ignore")

TEMP_DIR = "/tmp/audioclean_temp"

class AudioProcessor:
    def __init__(self, hf_token: str = None):
        self.hf_token = hf_token or os.getenv("HF_TOKEN")
        if not self.hf_token:
            warnings.warn("HuggingFace token not provided. Diarization may not work.")

        self.temp_dir = Path(tempfile.mkdtemp(prefix="audioclean_"))
        os.makedirs(self.temp_dir, exist_ok=True)

    def __del__(self):
        self.cleanup()

    def cleanup(self):
        try:
            if self.temp_dir.exists():
                shutil.rmtree(self.temp_dir)
            if os.path.exists("separated"):
                shutil.rmtree("separated")
        except Exception as e:
            print(f"Cleanup error: {e}")

    def convert_to_wav(self, input_file: str):
        ext = os.path.splitext(input_file)[1].lower()
        if ext == ".wav":
            print(f"{input_file} is already in WAV format. Proceeding...")
            return input_file
        elif ext in [".mp3"]:
            output_file = os.path.splitext(input_file)[0] + ".wav"
            try:
                sound = AudioSegment.from_file(input_file)
                sound.export(output_file, format="wav", parameters=["-acodec", "pcm_s16le"])
                print(f"{input_file} converted to {output_file}.")
                return output_file
            except Exception as e:
                print(f"pydub/FFmpeg error during conversion: {e}")
                return None
        else:
            print(f"Unsupported file format: {ext}")
            return None

    def noise_removal(self, input_file: str, output_file: str):
        try:
            y, sr = librosa.load(input_file, sr=None)
            noise_duration = min(2, len(y) / sr)
            noise_sample = y[:int(sr*noise_duration)]
            reduced_audio = nr.reduce_noise(
                y=y,
                sr=sr,
                y_noise=noise_sample,
                stationary=False,
                prop_decrease=1.0
            )
            audio_tensor = torch.tensor(reduced_audio, dtype=torch.float32)
            if audio_tensor.ndim == 1:
                audio_tensor = torchaudio.functional.highpass_biquad(audio_tensor, sample_rate=sr, cutoff_freq=100.0)
            audio_np = audio_tensor.numpy()
            audio_np = medfilt(audio_np, kernel_size=5)
            sf.write(output_file, audio_np, sr)
            print(f"Denoising completed! Saved as '{output_file}'")
            return output_file
        except Exception as e:
            print(f"Error during noise removal: {e}")
            return None

    def check_demucs_installed(self):
        try:
            subprocess.run(["demucs", "--help"], capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False

    def install_demucs(self):
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "demucs"])
            print("Demucs installed successfully")
            return True
        except Exception as e:
            print(f"Failed to install demucs: {e}")
            return False

    def separate_audio_robust(self, input_file: str, mode: str):
        try:
            if not self.check_demucs_installed():
                print("Demucs not installed. Attempting installation...")
                if not self.install_demucs():
                    raise RuntimeError("Failed to install demucs or installation check failed.")
            if mode == "1":
                cmd = ["demucs", input_file]
            else:
                cmd = ["demucs", "--two-stems=vocals", input_file]
            print(f"Running demucs with command: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
            if result.returncode != 0:
                print(f"Demucs execution failed. Stdout: {result.stdout}")
                print(f"Demucs error: {result.stderr}")
                return None
            base_name = os.path.splitext(os.path.basename(input_file))[0]
            expected_output_dir = os.path.join("separated", "htdemucs", base_name)
            if not os.path.isdir(expected_output_dir):
                search_pattern = os.path.join("separated", "*", base_name)
                found_dirs = glob.glob(search_pattern)
                if found_dirs:
                    output_dir = max(found_dirs, key=os.path.getmtime)
                else:
                    print("No output directory found.")
                    return None
            else:
                output_dir = expected_output_dir
            wav_files = [f for f in os.listdir(output_dir) if f.endswith('.wav')]
            if not wav_files:
                print("No WAV files found in output directory")
                return None
            print(f"Found {len(wav_files)} WAV files: {wav_files}")
            return output_dir
        except subprocess.TimeoutExpired:
            print("Demucs process timed out (exceeded 10 minutes)")
            return None
        except Exception as e:
            print(f"Separation error: {e}")
            return None

    def diarize_and_transcribe(self, audio_file: str, num_speakers: int = 2):
        if not self.hf_token:
            raise RuntimeError("HuggingFace token (HF_TOKEN) is missing. Diarization requires it for pyannote.")
        try:
            print("Loading diarization pipeline...")
            pipeline = Pipeline.from_pretrained(
                "pyannote/speaker-diarization-3.1",
                use_auth_token=self.hf_token
            )
            device = torch.device("cpu")
            pipeline = pipeline.to(device)
            original_audio = AudioSegment.from_wav(audio_file)
            print("Running diarization...")
            diarization = pipeline(audio_file, num_speakers=num_speakers, min_speakers=1)
            vocals_file_name = os.path.basename(audio_file)
            session_id = vocals_file_name.split('_')[0]
            speaker_segments = {}
            for segment, _, speaker in diarization.itertracks(yield_label=True):
                speaker_id = speaker.replace('SPEAKER_', '')
                speaker_segments.setdefault(speaker_id, []).append(segment)
            print("Loading Whisper model...")
            model = whisper.load_model("small")
            results = []
            # Save each speaker to TEMP_DIR for direct access
            for speaker_id, segments in speaker_segments.items():
                segments.sort(key=lambda x: x.start)
                speaker_audio = AudioSegment.silent(duration=0)
                for segment in segments:
                    start_ms = int(segment.start * 1000)
                    end_ms = int(segment.end * 1000)
                    segment_audio = original_audio[start_ms:end_ms]
                    speaker_audio += segment_audio
                combined_speaker_filename = f"{session_id}_speaker_{speaker_id}.wav"
                combined_speaker_file = os.path.join(TEMP_DIR, combined_speaker_filename)  # FIXED: always save to TEMP_DIR
                speaker_audio.export(combined_speaker_file, format="wav")
                result = model.transcribe(combined_speaker_file, language="en")
                total_speech_duration = sum([(seg.end - seg.start) for seg in segments])
                results.append({
                    'speaker': speaker_id,
                    'duration': total_speech_duration,
                    'text': result['text'],
                    'audio_download_path': f"/download_temp/{combined_speaker_filename}"
                })
            return results
        except Exception as e:
            print(f"Error during diarization/transcription: {e}")
            return None

    def transcribe_audio_only(self, audio_file: str):
        try:
            print("Loading Whisper model for transcription...")
            model = whisper.load_model("small")
            result = model.transcribe(audio_file, language="en")
            return [{
                'speaker': "All",
                'duration': "Full audio",
                'text': result['text']
            }]
        except Exception as e:
            print(f"Error during transcription: {e}")
            return None