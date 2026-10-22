// src/components/EquipmentCard.jsx
import React, { useState } from 'react';

export default function EquipmentCard({ item, onIssue, onReturn }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const displayPhotos = item.status === 'Rented Out' 
    ? (item.postReturnPhotos || []) 
    : (item.preIssuePhotos || []);

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await fetch(`http://localhost:5000/api/equipment/recommendations/${item._id}`);
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              item.status === 'Available in Shop'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {item.status}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-1">
          Serial: <span className="text-slate-200">{item.serialNo}</span>
        </p>
        <p className="text-xs text-slate-400 mb-3">
          Category: <span className="text-slate-200">{item.category}</span>
        </p>

        {/* 🤖 Option 2: AI Damage Audit Badge */}
        {item.damageDetected && (
          <div className="bg-red-500/15 border border-red-500/30 p-2.5 rounded-lg mb-3 text-xs text-red-300">
            <strong className="block text-red-400 mb-0.5">🤖 AI Damage Audit Alert:</strong>
            {item.damageReport} (Variance Score: {item.damageScore})
          </div>
        )}

        {displayPhotos.length > 0 && (
          <div className="my-3">
            <span className="text-xs text-amber-400 font-semibold block mb-1">
              📸 Inspection Photos ({displayPhotos.length}/4):
            </span>
            <div className={`grid gap-1.5 ${displayPhotos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {displayPhotos.map((imgSrc, i) => (
                <img
                  key={i}
                  src={imgSrc}
                  alt={`Condition ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-slate-700"
                />
              ))}
            </div>
          </div>
        )}

        {item.preDefects && (
          <p className="text-xs bg-slate-900/60 p-2 rounded border border-slate-700/50 text-slate-300 mb-3">
            <strong className="text-amber-400">Notes:</strong> {item.preDefects}
          </p>
        )}

        {/* 🤖 Option 1: AI Recommendations Section */}
        {item.status === 'Rented Out' && (
          <div className="mt-3 pt-2 border-t border-slate-700/60">
            <button
              onClick={fetchRecommendations}
              className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {loadingRecs ? 'Analyzing Specs...' : '🤖 Find Available AI Alternatives'}
            </button>

            {recommendations && recommendations.length > 0 && (
              <div className="mt-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-700 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-400 block mb-1">
                  Top Recommended Alternatives:
                </span>
                {recommendations.slice(0, 2).map((rec) => (
                  <div key={rec._id} className="flex justify-between items-center text-xs bg-slate-800 p-1.5 rounded">
                    <span className="truncate max-w-[170px] text-slate-200">{rec.title}</span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">
                      {rec.matchScore}% Match
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-700/50 mt-3">
        {item.status === 'Available in Shop' ? (
          <button
            onClick={() => onIssue(item)}
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded-lg transition cursor-pointer"
          >
            Issue Item
          </button>
        ) : (
          <button
            onClick={() => onReturn(item)}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm rounded-lg transition cursor-pointer"
          >
            Return Item
          </button>
        )}
      </div>
    </div>
  );
}