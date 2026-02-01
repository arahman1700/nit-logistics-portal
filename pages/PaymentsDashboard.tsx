import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Download, Filter, Search } from 'lucide-react';

export const PaymentsDashboard: React.FC = () => {
  
  // Mock Data
  const supplierData = [
    { name: 'AWTAD', amount: 450000 },
    { name: 'Zad Alomran', amount: 380000 },
    { name: 'ALMAMORAH', amount: 320000 },
    { name: 'FIFO', amount: 210000 },
    { name: 'CPCC', amount: 180000 },
  ];

  const projectData = [
    { name: 'JAZERA ROYAL', amount: 777340 },
    { name: 'JAFURAH', amount: 424900 },
    { name: 'Diriyah', amount: 304610 },
    { name: 'Murjan', amount: 235820 },
    { name: 'Makkah', amount: 223625 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Payments & Invoices</h1>
          <p className="text-gray-400 mt-1">Financial Overview and Analysis</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full md:w-64 flex items-center">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search invoices..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-sm text-gray-400">Total Invoices</p>
          </div>
          <p className="text-2xl font-bold text-white">1,159</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-nesma-secondary/20 rounded-lg text-nesma-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-gray-400">Total Amount</p>
          </div>
          <p className="text-2xl font-bold text-white">13.6M <span className="text-sm font-normal text-gray-400">SAR</span></p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-gray-400">Paid Status</p>
          </div>
          <p className="text-2xl font-bold text-green-400">96.5%</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-gray-400">Avg Cycle</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">4.2 <span className="text-sm font-normal text-gray-400">Days</span></p>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Suppliers by Amount</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
                <XAxis type="number" tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#fff', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#0E2841', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="amount" fill="#80D1E9" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Top Projects by Expenditure</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
                <XAxis type="number" tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#fff', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#0E2841', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="amount" fill="#2E3192" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="glass-card p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Recent Invoices</h3>
          <button className="text-sm text-nesma-secondary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="pb-3 pl-2">Invoice #</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Supplier</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 pr-2 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pl-2 font-mono text-gray-300">INV-2026-00{i}</td>
                  <td className="py-3">JAZERA ROYAL</td>
                  <td className="py-3">AWTAD</td>
                  <td className="py-3 text-right font-medium">12,500 SAR</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${i === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {i === 1 ? 'Pending' : 'Paid'}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right text-gray-400">Jan {10+i}, 2026</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};