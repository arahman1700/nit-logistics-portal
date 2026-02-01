
import React, { useEffect, useState } from 'react';
import { Package, AlertCircle, ArrowDown, ArrowUp, ArrowDownCircle, ArrowUpCircle, RefreshCw, Search } from 'lucide-react';
import { MOCK_INVENTORY } from '../constants';
import { useParams, useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string; icon: any; colorClass: string; bgClass: string }> = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className={`glass-card p-6 rounded-xl border-l-4 ${colorClass} hover:bg-white/5 transition-all`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 font-medium text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgClass} bg-opacity-20`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export const WarehouseDashboard: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'receive' | 'issue' | 'inventory'>('overview');

  useEffect(() => {
    if (tab) {
        // Map simplified tab names if needed
        const mappedTab = tab === 'mrrv' ? 'receive' : tab === 'mirv' ? 'issue' : tab as any;
        setActiveTab(mappedTab);
    } else {
        setActiveTab('overview');
    }
  }, [tab]);

  const handleTabChange = (newTab: string) => {
    // Map internal tab names to URL friendly names
    const urlTab = newTab === 'receive' ? 'receive' : newTab === 'issue' ? 'issue' : newTab;
    navigate(`/warehouse/${urlTab}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Warehouse Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage inventory movement and daily operations</p>
        </div>
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
          {['overview', 'receive', 'issue', 'inventory'].map((t) => (
            <button 
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap flex-1 md:flex-none ${
                activeTab === t 
                  ? 'bg-nesma-primary text-white shadow-lg shadow-nesma-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'receive' ? 'Receiving (MRRV)' : t === 'issue' ? 'Issuing (MIRV)' : t}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Today's Inbound" 
              value="12 Shipments" 
              icon={ArrowDownCircle} 
              colorClass="border-emerald-500" 
              bgClass="bg-emerald-500 text-emerald-400" 
            />
            <StatCard 
              title="Today's Outbound" 
              value="28 Requests" 
              icon={ArrowUpCircle} 
              colorClass="border-blue-500" 
              bgClass="bg-blue-500 text-blue-400" 
            />
            <StatCard 
              title="Pending Audit" 
              value="3 Items" 
              icon={RefreshCw} 
              colorClass="border-amber-500" 
              bgClass="bg-amber-500 text-amber-400" 
            />
             <StatCard 
              title="Stock Alerts" 
              value="5 Alerts" 
              icon={AlertCircle} 
              colorClass="border-red-500" 
              bgClass="bg-red-500 text-red-400" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-xl">
               <h3 className="font-bold text-lg text-white mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                 <span>Incoming Requests</span>
                 <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Action Required</span>
               </h3>
               <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-emerald-500/30 group">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-500/20 p-2.5 rounded-lg border border-emerald-500/30">
                           <ArrowDown size={18} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-200 group-hover:text-white">Supplier Shipment #PO-49{i}</p>
                          <p className="text-xs text-gray-500">2 hours ago • Cement</p>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">New</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
               <h3 className="font-bold text-lg text-white mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
                 <span>Pending Issue Tasks</span>
                 <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">3 Tasks</span>
               </h3>
               <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-amber-500/30 group">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
                           <ArrowUp size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-200 group-hover:text-white">Project Request A-{i}2</p>
                          <p className="text-xs text-gray-500">Eng. Khaled • Steel Rebar</p>
                        </div>
                      </div>
                      <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-500/20">Processing</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </>
      )}

      {(activeTab === 'inventory' || activeTab === 'overview') && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
            <h3 className="font-bold text-lg text-white">Inventory Status</h3>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search item..." 
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm focus:border-nesma-secondary focus:ring-1 focus:ring-nesma-secondary outline-none text-white placeholder-gray-500 transition-all" 
                />
              </div>
              <button className="px-5 py-2 text-sm bg-nesma-primary hover:bg-nesma-accent text-white rounded-xl transition-all whitespace-nowrap shadow-lg shadow-nesma-primary/20">Add Item</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="nesma-table-head text-nesma-secondary text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Item Code</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Min Level</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {MOCK_INVENTORY.map((item) => {
                  const isLow = item.stockStatus === 'Low Stock' || item.stockStatus === 'Out of Stock';
                  return (
                    <tr key={item.id} className="nesma-table-row hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{item.code}</td>
                      <td className="px-6 py-4 text-gray-300">{item.name}</td>
                      <td className="px-6 py-4 font-bold text-nesma-secondary">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-500">{item.minLevel}</td>
                      <td className="px-6 py-4 text-gray-400">{item.location}</td>
                      <td className="px-6 py-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <AlertCircle size={12} />
                            {item.stockStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'receive' && (
        <div className="flex flex-col items-center justify-center h-80 glass-card rounded-2xl border border-dashed border-white/10 bg-black/20">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <ArrowDownCircle size={48} className="text-gray-500 opacity-50" />
          </div>
          <p className="text-gray-400 font-medium mb-1">Receiving Queue</p>
          <p className="text-xs text-gray-600">No active receiving tasks pending</p>
          <button className="mt-6 text-nesma-secondary hover:text-white text-sm font-medium hover:underline transition-colors">View All Incoming Shipments</button>
        </div>
      )}
      
      {activeTab === 'issue' && (
        <div className="flex flex-col items-center justify-center h-80 glass-card rounded-2xl border border-dashed border-white/10 bg-black/20">
          <div className="p-4 bg-white/5 rounded-full mb-4">
             <ArrowUpCircle size={48} className="text-gray-500 opacity-50" />
          </div>
          <p className="text-gray-400 font-medium mb-1">Issuing Queue</p>
          <p className="text-xs text-gray-600">No active issuing tasks pending</p>
          <button className="mt-6 text-nesma-secondary hover:text-white text-sm font-medium hover:underline transition-colors">View All MIRV Requests</button>
        </div>
      )}
    </div>
  );
};
