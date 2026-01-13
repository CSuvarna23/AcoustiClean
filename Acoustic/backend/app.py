#app.py
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import shutil, os, uuid
from pydub import AudioSegment
from processor import AudioProcessor
HF_TOKEN = os.getenv("HF_TOKEN")
processor = AudioProcessor(hf_token=HF_TOKEN)

TEMP_DIR = "/tmp/audioclean_temp"
os.makedirs(TEMP_DIR, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
HF_TOKEN = os.getenv("HF_TOKEN")
processor = AudioProcessor(hf_token=HF_TOKEN)

def copy_stem_files(source_dir: str, dest_dir: str, session_id: str) -> List[Dict[str, str]]:
    stems_data = []
    name_map = {
        'vocals.wav': 'Vocals',
        'bass.wav': 'Bass',
        'drums.wav': 'Drums',
        'other.wav': 'Other',
        'accompaniment.wav': 'Non-Vocals'
    }
    for filename in os.listdir(source_dir):
        if filename.endswith(".wav"):
            source_path = os.path.join(source_dir, filename)
            unique_filename = f"{session_id}_{filename}"
            dest_path = os.path.join(dest_dir, unique_filename)
            shutil.copy(source_path, dest_path)
            display_name = name_map.get(filename, filename)
            stems_data.append({
                "name": filename,
                "display_name": display_name,
                "download_path": f"/download_temp/{unique_filename}"
            })
    return stems_data

@app.post("/process")
async def handle_process(
    audio_file: UploadFile = File(...),
    processing_mode: str = Form(...),
    num_speakers: int = Form(2)
):
    session_id = str(uuid.uuid4())
    file_extension = os.path.splitext(audio_file.filename)[1].lower()
    temp_file_path_initial = os.path.join(TEMP_DIR, f"{session_id}_original{file_extension}")
    try:
        with open(temp_file_path_initial, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
        temp_file_path_wav = processor.convert_to_wav(temp_file_path_initial)
        if not temp_file_path_wav:
            raise HTTPException(status_code=500, detail="File conversion to WAV failed. Ensure FFmpeg is installed and accessible.")
        output_data: Dict[str, Any] = {}
        if processing_mode == "noise_removal":
            output_filename = f"{session_id}_denoised.wav"
            output_file_path = os.path.join(TEMP_DIR, output_filename)
            final_path = processor.noise_removal(temp_file_path_wav, output_file_path)
            if not final_path:
                raise HTTPException(status_code=500, detail="Noise removal failed.")
            output_data = {
                "output_filename": output_filename,
                "type": "download",
                "session_id": session_id
            }
        elif processing_mode == "transcription":
            transcription_results = processor.transcribe_audio_only(temp_file_path_wav)
            if transcription_results is None:
                raise HTTPException(status_code=500, detail="Transcription failed.")
            output_data = {
                "transcription": transcription_results[0]['text'],
                "type": "text_only",
                "session_id": session_id
            }
        elif processing_mode in ["vocals_non_vocals", "sound_separation"]:
            demucs_mode = "1" if processing_mode == "sound_separation" else "2"
            demucs_output_dir = processor.separate_audio_robust(temp_file_path_wav, demucs_mode)
            if not demucs_output_dir:
                raise HTTPException(status_code=500, detail="Audio separation (Demucs) failed. Check console for details.")
            stem_files = copy_stem_files(demucs_output_dir, TEMP_DIR, session_id)
            if processing_mode == "sound_separation":
                vocals_stem_file = next((s for s in stem_files if "vocals" in s["name"].lower()), None)
                transcription_results = []
                num_speakers_int = int(num_speakers)
                if vocals_stem_file:
                    vocals_file_name = vocals_stem_file["download_path"].split('/')[-1]
                    vocals_file_path_temp = os.path.join(TEMP_DIR, vocals_file_name)
                    print(f"Starting diarization on vocals file: {vocals_file_path_temp}")
                    transcription_results = processor.diarize_and_transcribe(vocals_file_path_temp, num_speakers_int) or []
                else:
                    print("Warning: Vocals stem not found for diarization.")
                output_data = {
                    "stems": stem_files,
                    "transcription": transcription_results,
                    "type": "complex_output",
                    "session_id": session_id
                }
            else:
                output_data = {
                    "stems": stem_files,
                    "type": "directory_output",
                    "session_id": session_id
                }
        else:
            raise HTTPException(status_code=400, detail=f"Invalid processing mode: {processing_mode}")

        return JSONResponse(content={"success": True, "data": output_data})
    except HTTPException as e:
        print(f"HTTP Exception caught: {e.detail}")
        raise e
    except Exception as e:
        print(f"An unexpected error occurred during processing: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    finally:
        if os.path.exists(temp_file_path_initial):
            os.remove(temp_file_path_initial)
        if 'temp_file_path_wav' in locals() and os.path.exists(temp_file_path_wav) and temp_file_path_wav != temp_file_path_initial:
            os.remove(temp_file_path_wav)

@app.get("/download_temp/{filename}")
async def download_temp_file(filename: str):
    file_path = os.path.join(TEMP_DIR, filename)
    if not os.path.abspath(file_path).startswith(os.path.abspath(TEMP_DIR)):
        raise HTTPException(status_code=400, detail="Invalid file path.")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="audio/wav" if filename.endswith(".wav") else "application/octet-stream"
    )

@app.post("/merge_audios")
async def merge_audios(audio_files: List[str] = Body(...)):
    out_filename = f"merged_final_{uuid.uuid4().hex}.wav"
    out_path = os.path.join(TEMP_DIR, out_filename)
    stems = []
    for fname in audio_files:
        file_path = os.path.join(TEMP_DIR, fname)
        if os.path.exists(file_path):
            stems.append(AudioSegment.from_file(file_path))
    if not stems:
        raise HTTPException(status_code=400, detail="No valid audio files selected for mixing.")
    maxlen = max(len(s) for s in stems)
    padded = [s + AudioSegment.silent(duration=maxlen - len(s)) if len(s) < maxlen else s for s in stems]
    combined = padded[0]
    for s in padded[1:]:
        combined = combined.overlay(s)
    combined.export(out_path, format='wav')
    return {"success": True, "download_path": f"/download_temp/{out_filename}"}

@app.post("/cleanup")
async def cleanup_files():
    processor.cleanup()
    os.makedirs(TEMP_DIR, exist_ok=True)
    return {"message": "Temporary files cleaned up successfully."}

