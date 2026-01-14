# 🎧 AcoustiClean – AI-Powered Audio Processing System

AcoustiClean is an AI-driven audio enhancement platform that provides advanced sound processing features such as **noise removal, vocal separation, multi-source separation & merging, and automatic speech transcription**.

It integrates a **FastAPI backend** with a **React frontend**, offering fast, reliable, and user-friendly audio enhancement.

---

## 📂 Project Structure

```text
AcoustiClean/
│
├── backend/
│   ├── app.py            # FastAPI backend with API endpoints
│   ├── processor.py      # Core audio processing logic (Spleeter, PyDub, Librosa)
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React UI logic
│   │   └── App.css       # Styling for the interface
│   ├── public/
│   │   └── index.html    # Root HTML
│   └── package.json      # Frontend dependencies & scripts
│
└── tmp/
    └── audioclean_temp   # Temporary folder for intermediate audio outputs



---

## ✨ Key Features

### 1️⃣ Noise Removal
- Uses audio filtering + ML-based denoising
- Removes background hiss, hum, static, and wind noise

---

### 2️⃣ Vocal and Non-Vocal Separation
- Separates:
  - 🎤 Vocals
  - 🎵 Instrumental (music)
- Useful for karaoke, remix production, and music analysis

---

### 3️⃣ Audio Source Separation & Merging
- Extracts multiple speakers or instruments
- Allows:
  - Selecting specific components (e.g., Speaker 1, Speaker 2)
  - Merging selected components into a new audio file
- Uses **Demucs + custom processing** for multi-source separation

---

### 4️⃣ Speech Transcription
- Converts speech to text using **OpenAI Whisper**
- Supports:
  - Speaker diarization (who spoke when)
  - Multi-speaker transcription
- Ideal for meetings, podcasts, and interviews

---

## 🛠️ Technologies Used

### 🔹 Backend (FastAPI)
- Python 3.x
- FastAPI
- PyDub
- Librosa
- OpenAI Whisper
- NumPy / SciPy

### 🔹 Frontend (React.js)
- React + Hooks
- Fetch API for backend communication
- Custom UI for uploading and downloading audio

---

## 🚀 How to Run the Project

### 🔧 Backend Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000

### 🔧 Frontend Setup

cd frontend
npm install
npm start



📌 Usage Flow

Upload an audio file (WAV / MP3)

Choose one of the four processing modes

Backend processes the file

Download output(s):

Cleaned audio

Vocal-only or music-only

Separated components

Transcription text file

Temporary files are auto-cleared after processing






📜 Future Enhancements

🚀 Faster AI processing with full GPU acceleration

🌐 Real-time audio processing

🗣️ Multi-language transcription support

🎯 Higher accuracy in separation, diarization, and noise cleaning

📊 Web-based project dashboard
