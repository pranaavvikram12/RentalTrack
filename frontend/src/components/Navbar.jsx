import React from 'react';
import { ShieldCheck, UserCheck, Wrench, PackageCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="w-full bg-[#1e293b] border-b border-slate-700 text-slate-200">
      <div className="bg-[#0f172a] text-xs py-2 px-6 flex justify-between items-center border-b border-slate-800 text-slate-400">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Merchant Terminal</span>
          <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-amber-500" /> Inspection Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] px-2 py-0.5 rounded font-mono">SHOP-8821</span>
          <button className="hover:text-white flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Shopkeeper</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2.5 rounded-md">
            <PackageCheck className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white">RENTAL<span className="text-amber-500">TRACK</span></h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Storekeeper Asset & Defect Management</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['inventory', 'rented'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {tab === 'inventory' ? 'All Inventory' : 'Issued / Returns'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}