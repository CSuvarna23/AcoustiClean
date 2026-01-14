🎧 AcoustiClean – AI-Powered Audio Processing System

AcoustiClean is an AI-driven audio enhancement platform that provides advanced sound processing features such as noise removal, vocal separation, multi-source separation and merging, and automatic speech transcription.
It integrates a FastAPI backend with a React frontend, offering fast, reliable, and user-friendly audio enhancement.

📂 Project Structure
/backend
  ├── app.py                  # FastAPI backend with API endpoints
  ├── processor.py            # Core audio processing logic (Spleeter, PyDub, Librosa)
  ├── requirements.txt        # Python dependencies

/frontend
  ├── src/App.js              # Main React UI logic
  ├── src/App.css             # Styling for the interface
  ├── public/index.html       # Root HTML
  ├── package.json            # Frontend dependencies & scripts

/tmp/audioclean_temp          # Temporary folder for intermediate audio outputs

✨ Key Features
1️⃣ Noise Removal

Uses audio filtering + ML-based denoising.

Removes background hiss, hum, static, wind noise, etc.

2️⃣ Vocal and Non-Vocal Separation

Separates:

Vocals

Instrumental (music)

Useful for karaoke, remix production, and music analysis.

3️⃣ Audio Source Separation & Merging

Extracts multiple speakers or instruments.

Allows:

Selecting specific components (e.g., Speaker 1, Speaker 2)

Merging selected components into a new audio file.

Uses demucs + custom processing for multi-source separation.

4️⃣ Speech Transcription

Converts speech to text using OpenAI Whisper.

Supports:

Speaker diarization (who spoke when)

Multi-speaker transcription

Useful for meetings, podcasts, and interviews.

🛠️ Technologies Used
Backend (FastAPI)

Python 3.x

FastAPI

PyDub

Librosa

OpenAI Whisper

NumPy / SciPy

Frontend (React.js)

React + Hooks

Fetch API for backend communication

Custom UI components for uploading and downloading audio

🚀 How to Run the Project
Backend Setup

python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd Acoustic
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000

Frontend Setup
cd frontend
npm install
npm start

📌 Usage Flow

Upload an audio file (WAV/MP3).

Choose one of the four processing modes.

Backend processes the file.

User receives downloadable output(s):

Cleaned audio

Vocal-only or music-only

Separated components

Transcription text file



Files are auto-cleared after processing to maintain performance.

📜 Future Enhancements

Faster AI Processing with Full GPU Acceleration

Expanded Features such as Real-Time Processing and Multilingual Support

Multi-language transcription

Higher Accuracy in Separation, Diarization, and Noise Cleaning

Web-based project dashboard


