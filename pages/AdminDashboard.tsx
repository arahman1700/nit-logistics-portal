
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ClipboardList, 
  Package, 
  Truck, 
  AlertTriangle,
  Box,
  Ship,
  Users,
  ArrowRight,
  Filter,
  Calendar
} from 'lucide-react';
import { MOCK_INVENTORY, MOCK_JOBS, RECENT_ACTIVITIES, MOCK_MRRV, MOCK_MIRV, MOCK_SHIPMENTS, MOCK_PROJECTS } from '../constants';
import { Link } from 'react-router-dom';

// Nesma Palette for Charts
const COLORS = ['#2E3192', '#80D1E9', '#0E2841', '#203366', '#B3B3B3'];

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string; label?: string }> = ({ title, value, icon: Icon, color, label }) => (
  <div className="glass-card p-6 rounded-xl flex items-start justify-between hover:border-nesma-secondary/30 transition-all duration-300 group">
    <div>
      <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-nesma-secondary transition-colors">{value}</h3>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      {label && <span className={`text-[10px] px-2 py-0.5 rounded-full mt-3 inline-block bg-white/10 border border-white/10 text-gray-300`}>{label}</span>}
    </div>
    <div className={`p-4 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={24} />
    </div>
  </div>
);

const QuickLinkCard: React.FC<{ title: string; icon: any; links: { label: string; path: string }[] }> = ({ title, icon: Icon, links }) => (
  <div className="glass-card p-6 rounded-xl hover:border-nesma-secondary/30 transition-all group h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-gradient-to-br from-nesma-primary to-nesma-dark text-white rounded-xl shadow-lg border border-white/10">
        <Icon size={22} />
      </div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
    </div>
    <ul className="space-y-3">
      {links.map((link, idx) => (
        <li key={idx} className="border-b border-white/5 last:border-0 pb-2 last:pb-0">
          <Link to={link.path} className="flex items-center justify-between text-gray-400 hover:text-nesma-secondary transition-colors group/link">
            <span className="text-sm font-medium">{link.label}</span>
            <ArrowRight size={14} className="text-nesma-secondary opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('All');
  const [timeRange, setTimeRange] = useState('30days');

  // Filter Data Logic
  const filteredData = useMemo(() => {
    return {
      jobs: MOCK_JOBS.filter(j => selectedProject === 'All' || j.project === selectedProject),
      mirv: MOCK_MIRV.filter(m => selectedProject === 'All' || m.project === selectedProject),
      mrrv: MOCK_MRRV, // MRRV usually warehouse specific, but can link to project via PO
      projects: MOCK_PROJECTS
    };
  }, [selectedProject, timeRange]);

  // Calculated stats based on dynamic filters
  const pendingRequests = filteredData.mirv.filter(m => m.status === 'Pending Approval').length + filteredData.mrrv.filter(m => m.status === 'Pending Approval').length;
  const activeJobs = filteredData.jobs.filter(j => j.status === 'In Progress' || j.status === 'Assigning').length;
  const incomingShipments = MOCK_SHIPMENTS.filter(s => s.status === 'In Transit').length; // Global
  const lowStockItems = MOCK_INVENTORY.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length; // Global
  
  // Inventory Movement Chart Data (Mock generated based on filter)
  const inventoryData = useMemo(() => {
    const multiplier = selectedProject === 'All' ? 1 : 0.4;
    return [
      { name: 'Week 1', in: Math.floor(45 * multiplier), out: Math.floor(30 * multiplier) },
      { name: 'Week 2', in: Math.floor(20 * multiplier), out: Math.floor(40 * multiplier) },
      { name: 'Week 3', in: Math.floor(60 * multiplier), out: Math.floor(25 * multiplier) },
      { name: 'Week 4', in: Math.floor(35 * multiplier), out: Math.floor(50 * multiplier) },
    ];
  }, [selectedProject]);

  const jobTypesData = useMemo(() => [
    { name: 'Transport', value: filteredData.jobs.filter(j => j.type === 'Transport').length || 0 },
    { name: 'Equipment', value: filteredData.jobs.filter(j => j.type === 'Equipment').length || 0 },
    { name: 'Generators', value: filteredData.jobs.filter(j => j.type.includes('Generator')).length || 0 },
    { name: 'Rental', value: filteredData.jobs.filter(j => j.type.includes('Rental')).length || 0 },
  ].filter(d => d.value > 0), [filteredData.jobs]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filters */}
      <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white glow-text">Executive Dashboard</h1>
           <p className="text-gray-400 text-sm mt-1">Real-time logistics and supply chain overview</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
              <Filter size={16} className="text-nesma-secondary" />
              <select 
                className="bg-transparent border-none outline-none text-sm text-white focus:ring-0 cursor-pointer"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="All">All Projects</option>
                {MOCK_PROJECTS.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
           </div>

           <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
              <Calendar size={16} className="text-nesma-secondary" />
              <select 
                className="bg-transparent border-none outline-none text-sm text-white focus:ring-0 cursor-pointer"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last Quarter</option>
              </select>
           </div>
        </div>
      </div>

      {/* BLOCK 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon={ClipboardList} 
          color="bg-amber-500"
          label="Action Needed"
        />
        <StatCard 
          title="Active Job Orders" 
          value={activeJobs} 
          icon={Truck} 
          color="bg-emerald-500" 
          label="On Track"
        />
        <StatCard 
          title="Incoming Shipments" 
          value={incomingShipments} 
          icon={Package} 
          color="bg-nesma-secondary" 
          label="Logistics"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems} 
          icon={AlertTriangle} 
          color="bg-red-500" 
          label="Critical"
        />
      </div>

      {/* BLOCKS 6-7: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-white">Inventory Movement</h3>
             <div className="flex gap-4">
                <span className="text-xs flex items-center gap-2 font-medium text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> In</span>
                <span className="text-xs flex items-center gap-2 font-medium text-gray-400"><span className="w-2 h-2 rounded-full bg-nesma-primary"></span> Out</span>
             </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0E2841', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#80D1E9' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="in" fill="#34D399" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="out" fill="#2E3192" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-bold text-lg text-white mb-6">Job Orders by Type</h3>
          <div className="h-72 w-full flex justify-center">
            {jobTypesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {jobTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    layout="vertical" 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-400 text-xs ml-1">{value}</span>}
                  />
                  <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#0E2841', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center text-gray-500 h-full">No active jobs</div>
            )}
          </div>
        </div>
      </div>

      {/* BLOCKS 2-5: Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickLinkCard 
          title="Warehouses" 
          icon={Box}
          links={[
            { label: 'Receipt Vouchers (MRRV)', path: '/admin/warehouse/mrrv' },
            { label: 'Issue Vouchers (MIRV)', path: '/admin/warehouse/mirv' },
            { label: 'Return Vouchers (MRV)', path: '/admin/warehouse/mrv' },
            { label: 'Inventory Levels', path: '/admin/warehouse/inventory' },
          ]}
        />
        <QuickLinkCard 
          title="Transport & Equipment" 
          icon={Truck}
          links={[
            { label: 'Job Orders', path: '/admin/transport/job-orders' },
            { label: 'Fleet Management', path: '/admin/transport/fleet' },
            { label: 'Suppliers', path: '/admin/transport/suppliers' },
          ]}
        />
        <QuickLinkCard 
          title="Shipping & Customs" 
          icon={Ship}
          links={[
            { label: 'Shipments', path: '/admin/shipping/shipments' },
            { label: 'Customs Clearance', path: '/admin/shipping/customs' },
            { label: 'Reports', path: '/admin/shipping/reports' },
          ]}
        />
        <QuickLinkCard 
          title="Management" 
          icon={Users}
          links={[
            { label: 'Employees', path: '/admin/management/employees' },
            { label: 'Projects', path: '/admin/management/projects' },
            { label: 'General Reports', path: '/admin/reports/general' },
          ]}
        />
      </div>

      {/* BLOCK 8: Recent Activity */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-white">Recent Activity</h3>
          <button className="text-nesma-secondary text-sm hover:text-white font-medium hover:underline">View Full Log</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {RECENT_ACTIVITIES.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-sm text-gray-400">{log.time}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${
                      log.action.startsWith('MRRV') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      log.action.startsWith('MIRV') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      log.action.startsWith('JO') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {log.action.split('-')[0]}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-300">{log.details}</td>
                  <td className="py-3 text-sm text-gray-400">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
