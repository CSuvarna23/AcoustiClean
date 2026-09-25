# 🎧 AcoustiClean – An AI Audio Filtering System

AcoustiClean is an AI-driven audio enhancement platform that provides advanced sound processing features such as **noise removal, vocal separation, multi-source separation & merging, and automatic speech transcription**.

It integrates a **FastAPI backend** with a **React frontend**, offering fast, reliable, and user-friendly audio enhancement.

<img width="1600" height="778" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM" src="https://github.com/user-attachments/assets/ad5a8c86-de84-4fae-b204-9e6e34bdaba7" />



<img width="1600" height="767" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (2)" src="https://github.com/user-attachments/assets/230b0fb6-f12c-412f-a126-393ae8ba9530" />
<img width="1468" height="670" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (3)" src="https://github.com/user-attachments/assets/dbde6a34-7f4f-4e47-929b-20dd4f0f7d95" />
<img width="1600" height="768" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (4)" src="https://github.com/user-attachments/assets/2f354d68-a260-485a-b64c-03e22d4dee79" />
<img width="1600" height="900" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (5)" src="https://github.com/user-attachments/assets/7a77535f-9fc7-4aa6-853d-c8e881697041" />
<img width="1600" height="765" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (6)" src="https://github.com/user-attachments/assets/245c81c5-fb56-4cb2-a819-a738b8f37da5" />
<img width="1600" height="764" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (7)" src="https://github.com/user-attachments/assets/46c716e4-4717-468e-877e-d9ff2c2e2630" />
<img width="1600" height="758" alt="WhatsApp Image 2026-09-25 at 8 05 51 AM (8)" src="https://github.com/user-attachments/assets/24f5ddae-82b3-465b-b0f3-d887f4855362" />


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
