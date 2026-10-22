// src/components/CameraCapture.jsx
import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ existingPhotos = [], onCaptureComplete, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Using a ref for instant synchronous stream tracking
  const [photos, setPhotos] = useState(existingPhotos);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
        alert("Unable to access camera. Please check browser permissions.");
      });

    // Cleanup when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopCameraAndClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    onClose();
  };

  const takePhoto = () => {
    if (photos.length >= 4) {
      alert("Maximum limit of 4 photos reached.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const newImage = canvas.toDataURL('image/jpeg', 0.6);
      setPhotos((prev) => [...prev, newImage]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const confirmPhotos = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    onCaptureComplete(photos);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl max-w-lg w-full text-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Asset Inspection Camera</h3>
          <span className="text-xs bg-slate-700 px-2.5 py-1 rounded-full text-amber-400 font-semibold">
            {photos.length} / 4 Photos Taken
          </span>
        </div>

        <div className="relative bg-black rounded-lg aspect-video mb-3 overflow-hidden border border-slate-700">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {photos.map((imgSrc, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-600 aspect-square">
                <img src={imgSrc} alt={`Capture ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
          <button 
            type="button" 
            onClick={stopCameraAndClose} 
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium cursor-pointer"
          >
            Cancel
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={takePhoto}
              disabled={photos.length >= 4}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                photos.length >= 4 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
              }`}
            >
              📸 Snap Photo ({4 - photos.length} left)
            </button>

            <button
              type="button"
              onClick={confirmPhotos}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-lg text-sm cursor-pointer"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}