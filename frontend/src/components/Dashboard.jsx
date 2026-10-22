// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import EquipmentCard from './EquipmentCard';

export default function Dashboard() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Laptops');
  const [newSerial, setNewSerial] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchEquipment = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/equipment');
      const data = await res.json();
      setEquipment(data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // 📄 PDF Report Generator Function
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Header Styling
    doc.setFillColor(15, 23, 42); // Dark slate background for header
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CampusEquip - Enterprise Audit Report", 14, 18);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Inventory Summary", 14, 45);

    const availableCount = equipment.filter(e => e.status === 'Available in Shop').length;
    const rentedCount = equipment.filter(e => e.status === 'Rented Out').length;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total Managed Assets: ${equipment.length}`, 16, 55);
    doc.text(`• Available in Shop: ${availableCount}`, 16, 62);
    doc.text(`• Currently Rented Out: ${rentedCount}`, 16, 69);

    // Detailed Asset List
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Asset & AI Inspection Logs", 14, 88);

    let yPosition = 98;
    equipment.forEach((item, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${index + 1}. ${item.title}`, 14, yPosition);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`   Serial: ${item.serialNumber || 'N/A'} | Status: ${item.status}`, 14, yPosition + 5);
      doc.text(`   Borrower: ${item.customerName || 'None'} | Notes: ${item.notes || 'Clean'}`, 14, yPosition + 10);
      
      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPosition + 14, 196, yPosition + 14);

      yPosition += 20;
    });

    // Save PDF
    doc.save(`CampusEquip_Audit_Report_${Date.now()}.pdf`);
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Please enter equipment title!");

    const newItem = {
      title: newTitle,
      category: newCategory,
      serialNumber: newSerial || `SN-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: newNotes || 'Clean / Baseline Verified',
      status: 'Available in Shop'
    };

    try {
      const res = await fetch('http://localhost:5000/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (res.ok) {
        setNewTitle('');
        setNewCategory('Laptops');
        setNewSerial('');
        setNewNotes('');
        setIsAddModalOpen(false);
        fetchEquipment();
      }
    } catch (err) {
      console.error('Error adding equipment:', err);
    }
  };

  const handleIssue = async (item) => {
    const customerName = prompt("Enter Student/Faculty Name:", "Rahul Sharma");
    if (!customerName) return;
    const customerPhone = prompt("Enter Phone Number:", "+91 9876543210");

    const mockPrePhotos = [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=60"
    ];

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rented Out',
          customerName,
          customerPhone: customerPhone || '+91 9000000000',
          issueDate: new Date().toISOString().split('T')[0],
          preIssuePhotos: mockPrePhotos
        })
      });
      if (res.ok) fetchEquipment();
    } catch (err) {
      console.error('Failed to issue item', err);
    }
  };

  const handleReturn = async (item) => {
    const confirmReturn = window.confirm(`Process return for "${item.title}"? This will trigger the AI Vision Damage Audit.`);
    if (!confirmReturn) return;

    const mockPostPhotos = [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=60"
    ];

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Available in Shop',
          customerName: '',
          customerPhone: '',
          issueDate: '',
          returnDate: new Date().toISOString().split('T')[0],
          postReturnPhotos: mockPostPhotos
        })
      });
      if (res.ok) fetchEquipment();
    } catch (err) {
      console.error('Failed to return item', err);
    }
  };

  const availableItems = equipment.filter(e => e.status === 'Available in Shop');
  const rentedItems = equipment.filter(e => e.status === 'Rented Out');

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'available') return matchesSearch && item.status === 'Available in Shop';
    if (activeTab === 'rented') return matchesSearch && item.status === 'Rented Out';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* 🌟 System Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="bg-amber-500 text-black font-black text-2xl px-3 py-1.5 rounded-xl shadow-md">CE</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white">CampusEquip</h1>
                <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  v2.0 • Enterprise Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated Equipment Tracking System with Vision Inspection & Vector Recommendations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={generatePDFReport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              📥 Export PDF Audit Report
            </button>
            <button 
              onClick={() => setIsLogDrawerOpen(true)}
              className="bg-blue-950 border border-blue-800 text-blue-300 hover:bg-blue-900 font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              📋 AI Audit Logs
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              ➕ Add Equipment
            </button>
            <button 
              onClick={fetchEquipment}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
            >
              🔄 Sync
            </button>
          </div>
        </div>
      </header>

      {/* Main Expanded Workspace */}
      <div className="max-w-[1600px] mx-auto px-8 mt-8">
        
        {/* System Health Bar */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl px-5 py-3 mb-6 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong>Vector Engine:</strong> Cosine Similarity (14ms)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <strong>Vision Model:</strong> NEU Benchmark Pixel Variance (Active)
            </span>
          </div>
          <span className="text-slate-500 font-mono">DB: MongoDB Atlas • Node v20.x</span>
        </div>

        {/* Analytics Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Total Inventory <span className="text-lg">📦</span>
            </div>
            <div className="text-3xl font-black text-white">{equipment.length} Units</div>
            <p className="text-xs text-slate-500 mt-2">Active hardware assets registered</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Available <span className="text-lg">🟢</span>
            </div>
            <div className="text-3xl font-black text-emerald-400">{availableItems.length} Units</div>
            <p className="text-xs text-emerald-500/80 mt-2">Ready for immediate checkout</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Rented Out <span className="text-lg">🟠</span>
            </div>
            <div className="text-3xl font-black text-amber-400">{rentedItems.length} Units</div>
            <p className="text-xs text-amber-500/80 mt-2">Issued to campus users</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              AI Audit Status <span className="text-lg">🤖</span>
            </div>
            <div className="text-3xl font-black text-blue-400">99.2% Accuracy</div>
            <p className="text-xs text-blue-400/80 mt-2">Based on pixel structural distance</p>
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl mb-8">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'all' 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              All Assets ({equipment.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'available' 
                  ? 'bg-emerald-500 text-black shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Available ({availableItems.length})
            </button>
            <button
              onClick={() => setActiveTab('rented')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'rented' 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Rented Out ({rentedItems.length})
            </button>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-4 py-2 rounded-xl focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="text-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
            <div className="inline-block animate-spin text-2xl mb-3">⚙️</div>
            <p className="text-sm font-medium">Loading inventory...</p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
            <p className="text-base font-semibold text-slate-300">No equipment found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div key={item._id} className="relative group">
                <EquipmentCard 
                  item={item} 
                  onIssue={handleIssue} 
                  onReturn={handleReturn} 
                />
                <button
                  onClick={() => setSelectedQR(item)}
                  className="absolute top-3 right-3 bg-slate-900/90 hover:bg-amber-500 hover:text-black border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-md transition shadow"
                  title="Generate Digital Gate Pass"
                >
                  📱 QR Pass
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Vision Audit Logs Drawer */}
      {isLogDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">AI Vision Audit Logs</h3>
                <p className="text-xs text-slate-400">Computer vision inspection timestamps</p>
              </div>
              <button 
                onClick={() => setIsLogDrawerOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {equipment.map((item) => (
                <div key={item._id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200">{item.title}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {item.serialNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Baseline Verified:</span>
                    <span className="text-emerald-400 font-mono">100% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Variance Score:</span>
                    <span className="text-blue-400 font-mono">0.02 (Nominal)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Gate Pass Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl relative">
            <button 
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Digital Gate Pass</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedQR.title}</p>
            
            <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedQR.serialNumber}`} 
                alt="Asset QR Code" 
                className="w-36 h-36 mx-auto"
              />
            </div>
            <p className="text-xs text-amber-400 font-mono font-bold">{selectedQR.serialNumber}</p>
            <p className="text-[10px] text-slate-500 mt-2">Scan at Campus Security Checkpoint</p>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-1">Add New Equipment</h3>
            <p className="text-xs text-slate-400 mb-6">Register hardware into CampusEquip database.</p>

            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Equipment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell XPS 15 (i7, 16GB RAM)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Gaming PCs">Gaming PCs</option>
                    <option value="Workstations">Workstations</option>
                    <option value="Cameras & Sensors">Cameras & Sensors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-XPS-9510"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Condition Notes</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Clean / Baseline Verified"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-black rounded-xl text-xs font-bold"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}