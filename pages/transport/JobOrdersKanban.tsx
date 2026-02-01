import React, { useState } from 'react';
import { MOCK_JOBS } from '../../constants';
import { JobStatus, JobOrder } from '../../types';
import { 
  Calendar, 
  Truck, 
  User, 
  MoreHorizontal, 
  Plus, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Search,
  Filter
} from 'lucide-react';

const KanbanColumn: React.FC<{ 
  status: string; 
  jobs: JobOrder[]; 
  color: string; 
  borderColor: string;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  icon: any;
}> = ({ status, jobs, color, borderColor, onDrop, onDragStart, onDragOver, icon: Icon }) => (
  <div 
    className="min-w-[320px] max-w-[320px] glass-card rounded-2xl flex flex-col h-[calc(100vh-200px)] bg-black/20 border border-white/5 transition-colors"
    onDrop={(e) => onDrop(e, status)}
    onDragOver={onDragOver}
  >
    {/* Column Header */}
    <div className={`p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0E2841]/80 backdrop-blur-sm z-10 rounded-t-2xl`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${borderColor}/10 text-${borderColor}-400`}>
          <Icon size={18} />
        </div>
        <h3 className="font-bold text-white text-sm uppercase tracking-wide">
          {status}
        </h3>
      </div>
      <span className="bg-white/10 text-gray-300 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">{jobs.length}</span>
    </div>
    
    {/* Drop Zone Area */}
    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
      {jobs.map(job => (
        <div 
          key={job.id} 
          draggable
          onDragStart={(e) => onDragStart(e, job.id)}
          className={`bg-[#132D4B] p-4 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:bg-[#1A3A5E] hover:border-${borderColor}/50 transition-all group shadow-lg relative overflow-hidden`}
        >
          {/* Priority Stripe */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${
             job.priority === 'High' ? 'bg-red-500' : 
             job.priority === 'Medium' ? 'bg-orange-500' : 
             'bg-emerald-500'
          }`}></div>

          <div className="pl-2">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded bg-black/30 text-gray-400 font-mono tracking-wider border border-white/5`}>{job.id}</span>
              <button className="text-gray-500 hover:text-white transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
            
            <h4 className="font-bold text-gray-100 mb-2 text-sm leading-snug group-hover:text-nesma-secondary transition-colors line-clamp-2">
              {job.title}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                 <MapPin size={12} className="text-nesma-secondary" />
                 <span className="truncate">{job.project || 'Unassigned Project'}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                 <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded text-[10px] text-gray-300">
                    <Truck size={10} />
                    <span>{job.type}</span>
                 </div>
                 
                 {job.slaStatus && (
                   <span className={`text-[10px] font-bold ${
                     job.slaStatus === 'On Track' ? 'text-emerald-400' : 
                     job.slaStatus === 'At Risk' ? 'text-orange-400' : 
                     'text-red-400'
                   }`}>
                     {job.slaStatus}
                   </span>
                 )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {jobs.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-xl min-h-[150px]">
           <span className="text-xs opacity-50 font-medium">Drop items here</span>
        </div>
      )}
    </div>
  </div>
);

export const JobOrdersKanban: React.FC = () => {
  const [jobs, setJobs] = useState<JobOrder[]>(MOCK_JOBS);
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedJobId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedJobId) return;

    // Map string status to enum if needed, or just use string
    // Here we assume the status strings passed match the enum values or close enough
    const newStatus = status as JobStatus;

    setJobs(prev => prev.map(job => 
      job.id === draggedJobId ? { ...job, status: newStatus } : job
    ));
    setDraggedJobId(null);
  };

  const getJobsByStatus = (status: JobStatus) => jobs.filter(j => j.status === status);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">Job Orders Board</h1>
          <p className="text-sm text-gray-400 mt-1">Drag and drop cards to update status</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Search size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
             <input type="text" placeholder="Search orders..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-nesma-secondary" />
          </div>
          <button className="bg-nesma-primary text-white px-5 py-2 rounded-xl hover:bg-nesma-accent flex items-center gap-2 shadow-lg shadow-nesma-primary/20 transition-all border border-white/10">
            <Plus size={18} />
            <span className="hidden md:inline">New Job Order</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start snap-x">
        <KanbanColumn 
            status={JobStatus.NEW} 
            jobs={getJobsByStatus(JobStatus.NEW)} 
            color="bg-gray-400" 
            borderColor="gray" 
            onDrop={onDrop} 
            onDragStart={onDragStart} 
            onDragOver={onDragOver}
            icon={AlertCircle}
        />
        <KanbanColumn 
            status={JobStatus.ASSIGNING} 
            jobs={getJobsByStatus(JobStatus.ASSIGNING)} 
            color="bg-amber-400" 
            borderColor="amber" 
            onDrop={onDrop} 
            onDragStart={onDragStart} 
            onDragOver={onDragOver}
            icon={User}
        />
        <KanbanColumn 
            status={JobStatus.IN_PROGRESS} 
            jobs={getJobsByStatus(JobStatus.IN_PROGRESS)} 
            color="bg-nesma-secondary" 
            borderColor="blue" 
            onDrop={onDrop} 
            onDragStart={onDragStart} 
            onDragOver={onDragOver}
            icon={Truck}
        />
        <KanbanColumn 
            status={JobStatus.COMPLETED} 
            jobs={getJobsByStatus(JobStatus.COMPLETED)} 
            color="bg-emerald-400" 
            borderColor="emerald" 
            onDrop={onDrop} 
            onDragStart={onDragStart} 
            onDragOver={onDragOver}
            icon={CheckCircle}
        />
         <KanbanColumn 
            status={JobStatus.CANCELLED} 
            jobs={getJobsByStatus(JobStatus.CANCELLED)} 
            color="bg-red-400" 
            borderColor="red" 
            onDrop={onDrop} 
            onDragStart={onDragStart} 
            onDragOver={onDragOver}
            icon={XCircle}
        />
      </div>
    </div>
  );
};