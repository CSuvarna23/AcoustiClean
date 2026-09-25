🎧 AcoustiClean – AI Audio Filtering & Enhancement System

<p align="center">
  <strong>AI-powered audio enhancement for cleaner sound, source separation, and automatic speech transcription.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Audio-AI%20Processing-purple" alt="Audio AI Processing">
</p>

📌 Overview

AcoustiClean is an AI-driven audio enhancement platform designed to make audio processing simple and accessible through a web interface.

The system provides four major capabilities:

🔇 Noise removal

🎤 Vocal and instrumental separation

🎚️ Multi-source audio separation and merging

📝 Automatic speech transcription

AcoustiClean uses a FastAPI backend for audio processing and a React frontend for the user interface.

🖥️ Application Screenshots

🏠 Main Application Interface

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/ad5a8c86-de84-4fae-b204-9e6e34bdaba7" alt="AcoustiClean main application interface">
</p>

<p align="center"><em>AcoustiClean – Main application interface</em></p>

🎛️ Audio Processing Interface

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/230b0fb6-f12c-412f-a126-393ae8ba9530" alt="AcoustiClean audio processing interface">
</p>

<p align="center"><em>AcoustiClean – Audio processing workflow</em></p>

🔊 Audio Enhancement

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/2f354d68-a260-485a-b64c-03e22d4dee79" alt="AcoustiClean audio enhancement screen">
</p>

<p align="center"><em>AcoustiClean – Audio enhancement and processing controls</em></p>

🎤 Vocal Separation

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/7a77535f-9fc7-4aa6-853d-c8e881697041" alt="AcoustiClean vocal separation screen">
</p>

<p align="center"><em>AcoustiClean – Vocal and instrumental separation</em></p>

🎚️ Multi-Source Separation & Merging

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/245c81c5-fb56-4cb2-a819-a738b8f37da5" alt="AcoustiClean multi-source separation screen">
</p>

<p align="center"><em>AcoustiClean – Multi-source audio separation and component selection</em></p>

📝 Speech Transcription

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/46c716e4-4717-468e-877e-d9ff2c2e2630" alt="AcoustiClean speech transcription screen">
</p>

<p align="center"><em>AcoustiClean – Automatic speech transcription interface</em></p>

📥 Processed Audio & Results

<p align="center">
  <img width="100%" src="https://github.com/user-attachments/assets/24f5ddae-82b3-465b-b0f3-d887f4855362" alt="AcoustiClean processed audio results">
</p>

<p align="center"><em>AcoustiClean – Processed audio outputs and results</em></p>

✨ Key Features

1️⃣ Noise Removal

AcoustiClean applies audio filtering and ML-based denoising to reduce unwanted background sounds.

Can help reduce:

🔉 Background hiss

⚡ Electrical hum

📻 Static noise

🌬️ Wind noise

2️⃣ 🎤 Vocal & Non-Vocal Separation

The system separates an audio track into:

🎤 Vocals

🎵 Instrumental / Music

This can be useful for:

Karaoke

Remix production

Music analysis

Vocal extraction

3️⃣ 🎚️ Audio Source Separation & Merging

AcoustiClean supports multi-source audio processing by extracting individual speakers or instruments.

Users can:

Select specific components such as Speaker 1 or Speaker 2

Choose the components they want to keep

Merge selected components into a new audio file

The project uses Demucs + custom processing for multi-source separation.

4️⃣ 📝 Speech Transcription

AcoustiClean converts speech into text using OpenAI Whisper.

It supports:

🗣️ Speaker diarization — identifying who spoke when

👥 Multi-speaker transcription

📄 Exporting transcription as a text file

This can be useful for:

Meetings

Podcasts

Interviews

Recorded conversations

🏗️ System Architecture

                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  Upload / Controls   │
                    └──────────┬───────────┘
                               │
                               │ HTTP / API
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │    app.py / APIs     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Audio Processing     │
                    │     processor.py     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
         Noise Removal    Source Separation   Whisper
              │                │                 │
              └────────────────┼─────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Processed Outputs    │
                    │ Audio / Transcript   │
                    └──────────────────────┘

📂 Project Structure

AcoustiClean/
│
├── backend/
│   ├── app.py
│   ├── processor.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   │
│   └── package.json
│
└── tmp/
    └── audioclean_temp/

🛠️ Technologies Used

🔹 Backend

Technology

Purpose

🐍 Python 3.x

Core programming language

⚡ FastAPI

REST API backend

🎵 PyDub

Audio manipulation

📊 Librosa

Audio analysis and processing

🧠 OpenAI Whisper

Speech-to-text transcription

🔢 NumPy

Numerical processing

🧮 SciPy

Scientific and signal processing

🔹 Frontend

Technology

Purpose

⚛️ React.js

User interface

🪝 React Hooks

Frontend state and lifecycle management

🌐 Fetch API

Backend communication

🎨 CSS

Interface styling

🔹 Audio / AI Processing

Technology

Purpose

🎚️ Demucs

Multi-source audio separation

🎼 Spleeter

Audio source separation / processing

🧠 ML-based processing

Audio enhancement and denoising

🚀 Getting Started

Prerequisites

Make sure the following are installed:

Python 3.x

Node.js and npm

Git

Required Python audio/AI dependencies

🔧 Backend Setup

From the project directory:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install Python dependencies:

pip install -r backend/requirements.txt

Start the FastAPI server:

cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000

The backend will be available at:

http://localhost:8000

💻 Frontend Setup

Open a new terminal and run:

cd frontend
npm install
npm start

The React development server will start and provide the frontend interface.

🔄 Usage Flow

1. Upload an audio file
        ↓
2. Select a processing mode
        ↓
3. Backend processes the audio
        ↓
4. AI/audio processing is applied
        ↓
5. Download the generated output

Supported Input

WAV

MP3

Available Outputs

🔇 Cleaned audio

🎤 Vocal-only audio

🎵 Music / instrumental audio

🎚️ Separated audio components

📝 Transcription text file

Temporary processing files are automatically cleared after processing.

📁 Output Overview

Processing Mode

Example Output

🔇 Noise Removal

Cleaned audio

🎤 Vocal Separation

Vocal-only audio

🎵 Instrumental Separation

Music-only audio

🎚️ Multi-Source Separation

Individual audio components

📝 Transcription

Text transcription

🔮 Future Enhancements

The project can be extended with:

🚀 Faster AI processing through full GPU acceleration

🌐 Real-time audio processing

🗣️ Multi-language transcription

🎯 Improved separation, diarization, and noise-cleaning accuracy

📊 Web-based project dashboard

📌 Project Highlights

🎧 AcoustiClean combines modern web development with AI-powered audio processing to provide a single interface for cleaning, separating, merging, and transcribing audio.

The project demonstrates the integration of:

React → FastAPI → Audio Processing → AI Models → Downloadable Results

👩‍💻 Project Structure at a Glance

React Frontend
      │
      ▼
FastAPI REST API
      │
      ▼
Audio Processing Pipeline
      │
      ├── Noise Removal
      ├── Vocal Separation
      ├── Multi-Source Separation
      └── Speech Transcription
      │
      ▼
Processed Audio / Text
