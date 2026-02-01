
import React, { useMemo } from 'react';
import { MOCK_JOBS } from '../constants';
import { JobStatus, JobOrder } from '../types';
import { Calendar, Truck, User, MoreHorizontal, Plus, Users, Settings } from 'lucide-react';
import { useParams } from 'react-router-dom';

const KanbanColumn: React.FC<{ status: string; jobs: JobOrder[]; color: string; borderColor: string }> = ({ status, jobs, color, borderColor }) => (
  <div className="flex-1 min-w-[300px] glass-card rounded-2xl p-4 flex flex-col h-[calc(100vh-180px)] bg-black/20">
    <div className={`flex items-center justify-between mb-4 pb-3 border-b border-white/10`}>
      <h3 className="font-bold text-gray-200 flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        {status}
      </h3>
      <span className="bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full text-xs font-bold">{jobs.length}</span>
    </div>
    
    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
      {jobs.map(job => (
        <div key={job.id} className={`bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 hover:border-${borderColor}/50 transition-all group shadow-sm`}>
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[10px] px-2 py-1 rounded bg-black/30 text-gray-400 font-mono tracking-wider border border-white/5`}>{job.id}</span>
            <div className="flex gap-2">
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${
                job.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                job.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>{job.priority}</span>
              <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <h4 className="font-bold text-gray-100 mb-3 text-sm leading-snug group-hover:text-nesma-secondary transition-colors">{job.title}</h4>
          
          <div className="space-y-2 border-t border-white/5 pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Truck size={14} className="text-gray-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <User size={14} className="text-gray-500" />
              <span>{job.requester}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={14} className="text-gray-500" />
              <span>{job.date}</span>
            </div>
          </div>
        </div>
      ))}
      {jobs.length === 0 && (
        <div className="text-center py-12 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-xl">
           <Truck size={32} className="mb-2 opacity-30" />
           <span className="text-sm opacity-50">No Jobs</span>
        </div>
      )}
    </div>
  </div>
);

export const TransportDashboard: React.FC = () => {
  const { view } = useParams<{ view: string }>();

  const newJobs = MOCK_JOBS.filter(j => j.status === JobStatus.NEW);
  const assigningJobs = MOCK_JOBS.filter(j => j.status === JobStatus.ASSIGNING);
  const progressJobs = MOCK_JOBS.filter(j => j.status === JobStatus.IN_PROGRESS);
  const completedJobs = MOCK_JOBS.filter(j => j.status === JobStatus.COMPLETED);

  if (view === 'fleet') {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-3xl font-bold text-white glow-text">Fleet Management</h1>
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10">
          <Truck size={64} className="text-nesma-secondary/50 mb-4" />
          <h2 className="text-xl font-bold text-white">Fleet Overview</h2>
          <p className="text-gray-400 mt-2 text-center max-w-md">Detailed vehicle tracking, maintenance schedules, and driver assignments will be displayed here.</p>
        </div>
      </div>
    );
  }

  if (view === 'suppliers') {
    return (
      <div className="animate-fade-in space-y-6">
        <h1 className="text-3xl font-bold text-white glow-text">Transporter Suppliers</h1>
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10">
          <Users size={64} className="text-nesma-secondary/50 mb-4" />
          <h2 className="text-xl font-bold text-white">Supplier Directory</h2>
          <p className="text-gray-400 mt-2 text-center max-w-md">Manage 3PL contracts, performance ratings, and contact information here.</p>
        </div>
      </div>
    );
  }

  // Default to Jobs/Kanban view
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Job Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage vehicle fleet and equipment</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="hidden md:flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button className="px-4 py-1.5 text-sm bg-white/10 rounded-md font-medium text-white shadow-sm border border-white/10">Kanban</button>
            <button className="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">List</button>
          </div>
          <button className="bg-nesma-primary text-white px-5 py-2.5 rounded-xl hover:bg-nesma-accent flex items-center justify-center gap-2 shadow-lg shadow-nesma-primary/20 transition-all hover:scale-105 transform border border-white/10 w-full md:w-auto">
            <Plus size={18} />
            <span>New Job Order</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 flex-1 items-start snap-x snap-mandatory">
        <div className="snap-center"><KanbanColumn status="New" jobs={newJobs} color="bg-gray-400" borderColor="gray-400" /></div>
        <div className="snap-center"><KanbanColumn status="Assigning" jobs={assigningJobs} color="bg-amber-400" borderColor="amber-400" /></div>
        <div className="snap-center"><KanbanColumn status="In Progress" jobs={progressJobs} color="bg-nesma-secondary" borderColor="nesma-secondary" /></div>
        <div className="snap-center"><KanbanColumn status="Completed" jobs={completedJobs} color="bg-emerald-400" borderColor="emerald-400" /></div>
      </div>
    </div>
  );
};
