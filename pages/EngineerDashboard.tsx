import React from 'react';
import { PlusCircle, Clock, CheckCircle, XCircle, ArrowRight, FileText, Truck, Search } from 'lucide-react';
import { MOCK_JOBS } from '../constants';

export const EngineerDashboard: React.FC = () => {
  const myRequests = MOCK_JOBS.slice(0, 4); // Simulating engineer's own requests

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero - Nesma Identity */}
      <div className="bg-gradient-to-r from-nesma-primary to-nesma-dark rounded-2xl p-8 shadow-[0_0_40px_rgba(46,49,146,0.3)] relative overflow-hidden border border-white/10">
        {/* Decorative elements to match Nesma identity */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nesma-secondary/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-nesma-primary/30 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white glow-text">Welcome, Eng. Khaled</h1>
            <p className="text-nesma-secondary text-lg font-medium">Project: Olaya Towers (P-105)</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-nesma-dark px-6 py-3 rounded-xl font-bold hover:bg-nesma-secondary transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <PlusCircle size={20} className="text-nesma-primary" />
              <span>New Material Request</span>
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
              <Truck size={20} className="text-nesma-secondary" />
              <span>Transport Request</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests List */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
             <h3 className="font-bold text-lg text-white">Recent Requests</h3>
             <button className="text-sm text-nesma-secondary hover:text-white font-medium flex items-center gap-1 transition-colors">
               View All <ArrowRight size={14} />
             </button>
          </div>
          <div className="divide-y divide-white/5">
             {myRequests.map(req => (
               <div key={req.id} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors group cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-xl ${req.type === 'Transport' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                     {req.type === 'Transport' ? <Truck size={20} /> : <FileText size={20} />}
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{req.title}</h4>
                     <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                       <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-medium">{req.id}</span>
                       <span className="text-gray-600">•</span>
                       <span>{req.date}</span>
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                     req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                     req.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                     'bg-amber-500/10 text-amber-400 border-amber-500/20'
                   }`}>
                     {req.status}
                   </span>
                   <ArrowRight size={16} className="text-gray-600 group-hover:text-nesma-secondary transition-colors" />
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-lg text-white mb-6">Project Summary</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                    <CheckCircle size={18} />
                  </div>
                  <span className="font-medium text-gray-300">Completed</span>
                </div>
                <span className="text-2xl font-bold text-white">12</span>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    <Clock size={18} />
                  </div>
                  <span className="font-medium text-gray-300">In Progress</span>
                </div>
                <span className="text-2xl font-bold text-white">5</span>
              </div>

              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
                    <XCircle size={18} />
                  </div>
                  <span className="font-medium text-gray-300">Rejected/Cancelled</span>
                </div>
                <span className="text-2xl font-bold text-white">1</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                 <p className="text-sm text-gray-400 font-medium">Material Budget Usage</p>
                 <p className="text-xs text-nesma-secondary font-bold">75%</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-nesma-primary to-nesma-secondary h-2 rounded-full shadow-[0_0_10px_rgba(128,209,233,0.5)]" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};