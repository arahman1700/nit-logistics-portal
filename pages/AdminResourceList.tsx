import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Eye, MoreHorizontal } from 'lucide-react';
import { MOCK_MRRV, MOCK_MIRV, MOCK_MRV, MOCK_SHIPMENTS, MOCK_INVENTORY, MOCK_JOBS, MOCK_PROJECTS, MOCK_USERS, MOCK_RFIM, MOCK_OSD, AIRTABLE_WAREHOUSES, AIRTABLE_SUPPLIERS, AIRTABLE_EMPLOYEES } from '../constants';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  
  switch (status) {
    case 'Approved':
    case 'Delivered':
    case 'Completed':
    case 'Active':
    case 'In Stock':
    case 'Pass':
    case 'Resolved':
      colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      break;
    case 'Pending':
    case 'Pending Approval':
    case 'In Progress':
    case 'In Transit':
    case 'Assigning':
    case 'Low Stock':
    case 'Conditional':
    case 'Open':
      colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      break;
    case 'Rejected':
    case 'Cancelled':
    case 'Out of Stock':
    case 'Overdue':
    case 'Fail':
      colorClass = 'bg-red-500/20 text-red-400 border-red-500/30';
      break;
    case 'Issued':
    case 'Customs Clearance':
    case 'Inspected':
      colorClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      break;
    case 'Draft':
    case 'New':
      colorClass = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass} backdrop-blur-sm`}>
      {status}
    </span>
  );
};

export const AdminResourceList: React.FC = () => {
  const { section, resource } = useParams<{ section: string; resource: string }>();
  const navigate = useNavigate();

  // Determine form link based on resource
  const getFormLink = () => {
    switch (resource) {
      case 'mrrv': return '/admin/forms/mrrv';
      case 'mirv': return '/admin/forms/mirv';
      case 'mrv': return '/admin/forms/mrv';
      case 'job-orders': return '/admin/forms/jo';
      case 'rfim': return '/admin/forms/rfim';
      case 'osd': return '/admin/forms/osd';
      default: return '#';
    }
  };

  // Configuration for different resources based on "Airtable Views" Implementation Guide
  const config = useMemo(() => {
    switch (resource) {
      case 'mrrv': // Admin_All_MRRV
        return {
          title: 'Receipt Vouchers',
          code: 'MRRV',
          data: MOCK_MRRV,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'supplier', label: 'Supplier' },
            { key: 'date', label: 'Date' },
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'value', label: 'Value', format: (v: number) => `${v.toLocaleString()} SAR` },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
            { key: 'poNumber', label: 'PO Number' }, 
          ]
        };
      case 'mirv': // Admin_All_MIRV
        return {
          title: 'Issue Vouchers',
          code: 'MIRV',
          data: MOCK_MIRV,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'project', label: 'Project' },
            { key: 'requester', label: 'Requester' },
            { key: 'date', label: 'Date' },
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'value', label: 'Value', format: (v: number) => `${v.toLocaleString()} SAR` },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'mrv': // Admin_All_MRV
        return {
          title: 'Return Vouchers',
          code: 'MRV',
          data: MOCK_MRV,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'returnType', label: 'Return Type' },
            { key: 'date', label: 'Date' },
            { key: 'project', label: 'Project' },
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'shipments': // Admin_All_Shipments
        return {
          title: 'Shipments',
          code: 'SHP',
          data: MOCK_SHIPMENTS,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'supplier', label: 'Supplier' },
            { key: 'description', label: 'Description' },
            { key: 'etd', label: 'ETD' },
            { key: 'eta', label: 'ETA' },
            { key: 'port', label: 'Port' },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
            { key: 'agent', label: 'Agent' },
          ]
        };
      case 'inventory': // Admin_All_Inventory
        return {
          title: 'Inventory Levels',
          code: 'INV',
          data: MOCK_INVENTORY,
          columns: [
            { key: 'code', label: 'Item Code' },
            { key: 'name', label: 'Description' },
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'quantity', label: 'Available Qty' },
            { key: 'reserved', label: 'Reserved' },
            { key: 'onOrder', label: 'On Order' },
            { key: 'stockStatus', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'job-orders': // Admin_All_JO
        return {
          title: 'Job Orders',
          code: 'JO',
          data: MOCK_JOBS,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'type', label: 'Type' },
            { key: 'project', label: 'Project' },
            { key: 'requester', label: 'Requester' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
            { key: 'slaStatus', label: 'SLA', component: (v: any) => <span className={`text-xs font-bold ${v === 'On Track' ? 'text-green-400' : v === 'At Risk' ? 'text-orange-400' : 'text-red-400'}`}>{v}</span> },
            { key: 'vehicle', label: 'Vehicle' },
            { key: 'driver', label: 'Driver' },
          ]
        };
      case 'rfim': // Quality RFIM
        return {
          title: 'Inspection Requests',
          code: 'RFIM',
          data: MOCK_RFIM,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'mrrvId', label: 'MRRV ID' },
            { key: 'inspectionType', label: 'Inspection Type' },
            { key: 'priority', label: 'Priority' },
            { key: 'status', label: 'Result', component: (v: any) => <StatusBadge status={v} /> },
            { key: 'inspector', label: 'Inspector' },
          ]
        };
      case 'osd': // Quality OSD
        return {
          title: 'OSD Reports',
          code: 'OSD',
          data: MOCK_OSD,
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'mrrvId', label: 'MRRV ID' },
            { key: 'reportType', label: 'Type' },
            { key: 'qtyAffected', label: 'Qty' },
            { key: 'actionRequired', label: 'Action' },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'projects': // Admin_All_Projects
        return {
          title: 'Projects',
          code: 'PROJ',
          data: MOCK_PROJECTS,
          columns: [
            { key: 'name', label: 'Project Name' },
            { key: 'client', label: 'Client' },
            { key: 'region', label: 'Region' },
            { key: 'manager', label: 'Project Manager' },
            { key: 'status', label: 'Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'employees': // Admin_All_Employees - Real Airtable Data
        return {
          title: 'الموظفين | Employees',
          code: 'EMP',
          data: AIRTABLE_EMPLOYEES,
          columns: [
            { key: 'name', label: 'الاسم | Name' },
            { key: 'department', label: 'القسم | Department' },
            { key: 'title', label: 'المسمى | Job Title' },
            { key: 'site', label: 'الموقع | Site' },
          ]
        };
      case 'suppliers': // Transport Suppliers - Real Airtable Data
        return {
          title: 'الموردين | Suppliers',
          code: 'SUP',
          data: AIRTABLE_SUPPLIERS,
          columns: [
            { key: 'name', label: 'اسم المورد | Supplier Name' },
            { key: 'city', label: 'المدينة | City' },
            { key: 'type', label: 'النوع | Type' },
            { key: 'status', label: 'الحالة | Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'fleet': // Fleet Management
        return {
          title: 'إدارة الأسطول | Fleet Management',
          code: 'FLT',
          data: [
            { id: 'VH-001', type: 'Boom Truck 10T', plate: 'ABC 1234', status: 'Active', driver: 'Allauddin Ali', currentJob: 'JO-NIT-202506-0462' },
            { id: 'VH-002', type: 'Forklift 5T', plate: 'DEF 5678', status: 'Active', driver: 'Babu Ali', currentJob: 'JO-NIT-202504-0230' },
            { id: 'VH-003', type: 'Trella', plate: 'GHI 9012', status: 'Maintenance', driver: '-', currentJob: '-' },
            { id: 'VH-004', type: 'Diyanna 6M', plate: 'JKL 3456', status: 'Active', driver: 'Faheem Ahmed', currentJob: 'JO-NIT-202501-0848' },
            { id: 'VH-005', type: 'Crane 50T', plate: 'MNO 7890', status: 'Available', driver: '-', currentJob: '-' },
          ],
          columns: [
            { key: 'id', label: 'رقم المركبة | Vehicle ID' },
            { key: 'type', label: 'النوع | Type' },
            { key: 'plate', label: 'اللوحة | Plate' },
            { key: 'status', label: 'الحالة | Status', component: (v: any) => <StatusBadge status={v} /> },
            { key: 'driver', label: 'السائق | Driver' },
            { key: 'currentJob', label: 'أمر العمل | Current Job' },
          ]
        };
      case 'gate-pass': // Gate Passes
        return {
          title: 'تصاريح الخروج | Gate Passes',
          code: 'GP',
          data: [
            { id: 'GP-2026-001', mirvId: 'MIRV-2026-001', date: '2026-01-22', project: 'بوابة الدرعية', warehouse: 'Riyadh Warehouse', status: 'Issued', vehicle: 'VH-002' },
            { id: 'GP-2026-002', mirvId: 'MIRV-2026-003', date: '2026-01-21', project: 'PSSA', warehouse: 'Tabuk Warehouse', status: 'Issued', vehicle: 'VH-001' },
            { id: 'GP-2025-089', mirvId: 'MIRV-2025-089', date: '2025-12-15', project: 'Jafurah', warehouse: 'Jafurah Warehouse', status: 'Completed', vehicle: 'VH-003' },
          ],
          columns: [
            { key: 'id', label: 'رقم التصريح | Pass ID' },
            { key: 'mirvId', label: 'سند الصرف | MIRV Ref' },
            { key: 'date', label: 'التاريخ | Date' },
            { key: 'project', label: 'المشروع | Project' },
            { key: 'warehouse', label: 'المستودع | Warehouse' },
            { key: 'status', label: 'الحالة | Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      case 'stock-transfer': // Stock Transfers
        return {
          title: 'تحويلات المخزون | Stock Transfers',
          code: 'ST',
          data: [
            { id: 'ST-2026-001', date: '2026-01-20', fromWarehouse: 'Dammam Warehouse', toWarehouse: 'Riyadh Warehouse', items: 3, status: 'Completed' },
            { id: 'ST-2026-002', date: '2026-01-22', fromWarehouse: 'Jeddah Warehouse', toWarehouse: 'Makkah Warehouse', items: 5, status: 'In Transit' },
          ],
          columns: [
            { key: 'id', label: 'رقم التحويل | Transfer ID' },
            { key: 'date', label: 'التاريخ | Date' },
            { key: 'fromWarehouse', label: 'من مستودع | From' },
            { key: 'toWarehouse', label: 'إلى مستودع | To' },
            { key: 'items', label: 'عدد الأصناف | Items' },
            { key: 'status', label: 'الحالة | Status', component: (v: any) => <StatusBadge status={v} /> },
          ]
        };
      default:
        return { title: 'List', code: 'LIST', data: [], columns: [] };
    }
  }, [resource]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white glow-text">{config.title}</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span className="bg-nesma-primary/20 text-nesma-secondary px-2 py-0.5 rounded text-xs border border-nesma-primary/30">{config.code}</span>
            Manage and track all {config.title.toLowerCase()}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white text-sm transition-all">
             <Download size={16} />
             <span>Export</span>
           </button>
           {getFormLink() !== '#' && (
             <button 
               onClick={() => navigate(getFormLink())}
               className="flex items-center gap-2 px-4 py-2 bg-nesma-primary text-white rounded-lg hover:bg-nesma-accent text-sm shadow-lg shadow-nesma-primary/20 transition-all transform hover:-translate-y-0.5"
             >
               <Plus size={16} />
               <span>Add New</span>
             </button>
           )}
        </div>
      </div>

      {/* Glass Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
           <div className="relative flex-1 w-full md:max-w-md">
             <Search size={18} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
             <input 
               type="text" 
               placeholder={`Search ${config.title}...`} 
               className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-nesma-secondary/50 focus:ring-1 focus:ring-nesma-secondary/50 transition-all"
             />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
             <button className="flex items-center gap-2 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-all flex-1 md:flex-none justify-center">
               <Filter size={16} />
               <span>Filter</span>
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-all flex-1 md:flex-none justify-center">
                <span>View: List</span>
             </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="nesma-table-head text-nesma-secondary text-xs uppercase tracking-wider font-semibold">
              <tr>
                {config.columns.map((col: any, idx: number) => (
                  <th key={idx} className="px-6 py-4 whitespace-nowrap">{col.label}</th>
                ))}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {config.data.length > 0 ? (
                config.data.map((row: any, idx: number) => (
                  <tr key={idx} className="nesma-table-row group">
                    {config.columns.map((col: any, cIdx: number) => (
                      <td key={cIdx} className="px-6 py-4 whitespace-nowrap group-hover:text-white transition-colors">
                        {col.component ? col.component(row[col.key]) : (col.format ? col.format(row[col.key]) : row[col.key] || '-')}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 rounded-lg hover:bg-white/10 text-nesma-secondary hover:text-white transition-colors" title="View Details">
                           <Eye size={16} />
                         </button>
                         <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                           <MoreHorizontal size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Search size={24} className="text-gray-600" />
                        </div>
                        <p>No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
           <span className="text-xs text-gray-400">Showing <span className="text-white font-medium">1-{Math.min(20, config.data.length)}</span> of <span className="text-white font-medium">{config.data.length}</span> records</span>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 border border-white/10 rounded-lg bg-black/20 text-gray-400 text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 hover:text-white transition-all" disabled>Previous</button>
             <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg bg-nesma-primary text-white text-xs flex items-center justify-center shadow-lg shadow-nesma-primary/20">1</button>
                <button className="w-8 h-8 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400 text-xs flex items-center justify-center transition-all">2</button>
                <button className="w-8 h-8 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400 text-xs flex items-center justify-center transition-all">3</button>
             </div>
             <button className="px-3 py-1.5 border border-white/10 rounded-lg bg-black/20 text-gray-300 text-xs hover:bg-white/5 hover:text-white transition-all">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};