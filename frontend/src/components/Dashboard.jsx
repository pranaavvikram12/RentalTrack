import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import EquipmentCard from './EquipmentCard';
import BookingModal from './BookingModal';
import { Search } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [modalData, setModalData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial equipment data from Express backend
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/equipment');
      const data = await res.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to connect to backend:", err);
      setLoading(false);
    }
  };

  // Update item via Backend API
  const handleUpdateItem = async (updatedItem) => {
    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${updatedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setItems(items.map(i => i._id === updatedItem._id ? updatedItem : i));
      }
    } catch (err) {
      console.error("Failed to update equipment:", err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.serialNo.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'rented') return matchesSearch && item.status === 'Rented Out';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="bg-[#1e293b] border-b border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Inventory</p>
            <p className="text-2xl font-bold text-white mt-1">{items.length} Units</p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 font-semibold uppercase">Currently Out on Rent</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">{items.filter(i => i.status === 'Rented Out').length} Units</p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 font-semibold uppercase">Ready in Shop</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{items.filter(i => i.status === 'Available in Shop').length} Units</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">
              {activeTab === 'inventory' ? 'Store Inventory' : 'Issued Items Schedule'}
            </h2>
            <p className="text-xs text-slate-400">Manage issue dates, return deadlines, and pre/post defect logs.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search by asset or serial no..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading equipment inventory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <EquipmentCard 
                key={item._id} 
                item={item} 
                onDispatch={(i) => setModalData({ item: i, mode: 'dispatch' })}
                onReturn={(i) => setModalData({ item: i, mode: 'return' })}
              />
            ))}
          </div>
        )}

        {modalData && (
          <BookingModal 
            item={modalData.item} 
            mode={modalData.mode} 
            onClose={() => setModalData(null)}
            onSubmit={handleUpdateItem}
          />
        )}
      </section>
    </div>
  );
}