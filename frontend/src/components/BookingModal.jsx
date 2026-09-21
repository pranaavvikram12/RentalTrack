import React, { useState } from 'react';
import { X, ShieldAlert, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function BookingModal({ item, mode, onClose, onSubmit }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [preDefects, setPreDefects] = useState(item?.preDefects || '');
  const [postDefects, setPostDefects] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item,
      customerName: mode === 'dispatch' ? customerName : item.customerName,
      customerPhone: mode === 'dispatch' ? customerPhone : item.customerPhone,
      returnDate: mode === 'dispatch' ? returnDate : item.returnDate,
      issueDate: mode === 'dispatch' ? new Date().toISOString().split('T')[0] : item.issueDate,
      preDefects,
      postDefects: mode === 'return' ? postDefects : '',
      status: mode === 'dispatch' ? 'Rented Out' : 'Available in Shop'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="bg-[#0f172a] px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {mode === 'dispatch' ? <ArrowUpRight className="w-5 h-5 text-amber-500" /> : <ArrowDownLeft className="w-5 h-5 text-emerald-400" />}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {mode === 'dispatch' ? 'Issue Equipment' : 'Receive Return'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#0f172a] p-3.5 rounded border border-slate-800">
            <p className="text-base font-bold text-white">{item.title}</p>
            <p className="text-xs text-amber-500 font-mono">{item.serialNo}</p>
          </div>

          {mode === 'dispatch' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name</label>
                  <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input type="tel" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Return Date</label>
                <input type="date" required value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Pre-Existing Damage / Scratches
                </label>
                <textarea rows="2" value={preDefects} onChange={e => setPreDefects(e.target.value)} placeholder="E.g., Screen scratch on left, missing charger cap..." className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Post-Return Inspection / New Defects
              </label>
              <textarea rows="3" value={postDefects} onChange={e => setPostDefects(e.target.value)} placeholder="Log any new scratches, physical damage, or missing hardware..." className="w-full bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500" />
            </div>
          )}

          <button type="submit" className={`w-full font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-all mt-4 ${mode === 'dispatch' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}`}>
            {mode === 'dispatch' ? 'Confirm Issue & Log Pre-Defects' : 'Confirm Return & Update Status'}
          </button>
        </form>
      </div>
    </div>
  );
}