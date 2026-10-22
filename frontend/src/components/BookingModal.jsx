// src/components/BookingModal.jsx
import React, { useState } from 'react';
import CameraCapture from './CameraCapture';

export default function BookingModal({ selectedItem, mode, onClose, onSave }) {
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState(
    mode === 'issue' 
      ? selectedItem?.preIssuePhotos || [] 
      : selectedItem?.postReturnPhotos || []
  );
  const [notes, setNotes] = useState(
    mode === 'issue' ? selectedItem?.preDefects || '' : selectedItem?.postDefects || ''
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatePayload = mode === 'issue' ? {
      status: 'Rented Out',
      preDefects: notes,
      preIssuePhotos: photos,
    } : {
      status: 'Available in Shop',
      postDefects: notes,
      postReturnPhotos: photos,
    };

    const res = await fetch(`http://localhost:5000/api/equipment/${selectedItem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (res.ok) {
      onSave();
      onClose();
    } else {
      alert("Failed to update item.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-md w-full text-white">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'issue' ? 'Issue Equipment (Pre-Check)' : 'Return Equipment (Post-Check)'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Defect / Condition Notes</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              rows={3}
              placeholder="Record any scratches, damage, or condition notes..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm text-slate-400">Inspection Photos</label>
              <span className="text-xs text-amber-400">{photos.length} / 4 Photos</span>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative rounded border border-slate-700 overflow-hidden aspect-square">
                    <img src={p} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <button 
              type="button" 
              onClick={() => setShowCamera(true)}
              className="w-full py-2.5 bg-slate-800 border border-dashed border-slate-600 rounded-lg text-amber-400 font-medium hover:bg-slate-800/80 text-sm"
            >
              📷 {photos.length > 0 ? 'Manage / Add Photos' : 'Open Camera & Take Photos'}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-lg text-sm">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm cursor-pointer">
              {mode === 'issue' ? 'Confirm & Issue' : 'Confirm & Return'}
            </button>
          </div>
        </form>

        {showCamera && (
          <CameraCapture 
            existingPhotos={photos}
            onCaptureComplete={(updatedPhotos) => setPhotos(updatedPhotos)} 
            onClose={() => setShowCamera(false)} 
          />
        )}
      </div>
    </div>
  );
}