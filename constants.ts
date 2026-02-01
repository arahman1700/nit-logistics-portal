
import { UserRole, JobStatus, JobOrder, InventoryItem, ActivityLog, User, NavItem, MRRV, MIRV, MRV, Shipment, Project, RFIM, OSDReport } from './types';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  Box,
  FileCheck,
  Ship,
  FileText,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Anchor,
  LogOut,
  Map,
  Shield,
  FilePlus,
  AlertTriangle,
  PieChart,
  CreditCard,
  MapPin
} from 'lucide-react';

// ========================================
// REAL AIRTABLE DATA - NIT Logistics
// Base ID: appwlEJBlwoSBdKoT
// Last Updated: 2026-02-01
// ========================================

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Abdulrahman (Admin)', email: 'admin@nit.com', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Rabbani Mohammed (Warehouse)', email: 'rabbani@nit.com', role: UserRole.WAREHOUSE, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Hassan Taher (Transport)', email: 'hassan@nit.com', role: UserRole.TRANSPORT, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Eng. Mohammed Alamri', email: 'mohammed.alamri@nesma.com', role: UserRole.ENGINEER, avatar: 'https://i.pravatar.cc/150?u=4' },
];

export const RECENT_ACTIVITIES: ActivityLog[] = [
  { id: '1', time: '10:30', action: 'JO-NIT-202506-0462', user: 'Tasawour', details: 'Transport to Haram - Boom Truck 10T - Completed', type: 'success' },
  { id: '2', time: '10:15', action: 'MIRV-2026-001', user: 'Eng. Khaled', details: 'صرف كابلات كهربائية لبوابة الدرعية', type: 'info' },
  { id: '3', time: '09:45', action: 'MRRV-2026-0145', user: 'Abdullah Namshan', details: 'استلام كابلات كهربائية - DN-78542', type: 'warning' },
  { id: '4', time: '09:00', action: 'JO-NIT-202504-0230', user: 'Ahmed Tosson', details: 'Forklift 5T - ALMURJAN - Completed', type: 'info' },
  { id: '5', time: '08:30', action: 'MRRV-2026-0132', user: 'Metrotech Arabia', details: 'معدات سلامة لـ PSSA - Approved', type: 'success' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', code: 'CABLE-CU-50', name: 'كابل نحاسي 50مم', warehouse: 'Dammam Warehouse', quantity: 3200, reserved: 500, onOrder: 0, stockStatus: 'In Stock', minLevel: 500, reorderPoint: 600, category: 'Electrical', location: 'WH-A-01' },
  { id: '2', code: 'STEEL-12MM', name: 'حديد تسليح 12مم', warehouse: 'Riyadh Warehouse', quantity: 1500, reserved: 200, onOrder: 500, stockStatus: 'In Stock', minLevel: 300, reorderPoint: 400, category: 'Steel', location: 'WH-B-05' },
  { id: '3', code: 'SAFETY-VEST', name: 'سترة سلامة عاكسة', warehouse: 'Tabuk Warehouse', quantity: 80, reserved: 20, onOrder: 100, stockStatus: 'Low Stock', minLevel: 100, reorderPoint: 120, category: 'Safety', location: 'WH-S-01' },
  { id: '4', code: 'CIRCUIT-BRK', name: 'قواطع كهربائية', warehouse: 'Jeddah Warehouse', quantity: 450, reserved: 50, onOrder: 200, stockStatus: 'In Stock', minLevel: 200, reorderPoint: 250, category: 'Electrical', location: 'WH-E-03' },
  { id: '5', code: 'FORKLIFT-PART', name: 'قطع غيار رافعة شوكية', warehouse: 'Jubail Warehouse', quantity: 25, reserved: 5, onOrder: 30, stockStatus: 'Low Stock', minLevel: 30, reorderPoint: 40, category: 'Spare Parts', location: 'WH-P-01' },
  { id: '6', code: 'CEMENT-SR', name: 'أسمنت مقاوم', warehouse: 'Makkah Warehouse', quantity: 0, reserved: 0, onOrder: 500, stockStatus: 'Out of Stock', minLevel: 500, reorderPoint: 600, category: 'Construction', location: 'WH-C-02' },
  { id: '7', code: 'PIPE-PVC-6', name: 'أنابيب PVC 6 بوصة', warehouse: 'Madinah Warehouse', quantity: 800, reserved: 100, onOrder: 0, stockStatus: 'In Stock', minLevel: 200, reorderPoint: 300, category: 'Plumbing', location: 'WH-P-05' },
  { id: '8', code: 'GEN-FILTER', name: 'فلتر مولد CAT', warehouse: 'Hafir Albatin Warehouse', quantity: 15, reserved: 0, onOrder: 20, stockStatus: 'Low Stock', minLevel: 20, reorderPoint: 25, category: 'Spare Parts', location: 'WH-G-01' },
];

// ========================================
// REAL JOB ORDERS FROM AIRTABLE
// ========================================
export const MOCK_JOBS: JobOrder[] = [
  // Recent Job Orders from Airtable
  {
    id: 'JO-NIT-202506-0462',
    type: 'Transport',
    title: 'Boom Truck 10 Ton - Haram Project',
    requester: 'Tasawour',
    date: '2025-06-30',
    status: JobStatus.COMPLETED,
    priority: 'High',
    project: 'Haram',
    slaStatus: 'On Track',
    vehicle: 'Boom Truck',
    driver: 'Awtad Alsharq',
    cargoType: 'Construction Material',
    cargoWeightTons: 10
  },
  {
    id: 'JO-NIT-202504-0230',
    type: 'Equipment',
    title: 'Forklift 5 ton - ALMURJAN',
    requester: 'Ahmed Tosson',
    date: '2025-04-07',
    status: JobStatus.COMPLETED,
    priority: 'Medium',
    project: 'ALMURJAN',
    slaStatus: 'On Track',
    includeLoadingEquipment: true,
    loadingEquipmentType: 'Forklift 5T'
  },
  {
    id: 'JO-NIT-202412-0448',
    type: 'Transport',
    title: 'Lobed, Trella & Forklift 10T - Haram',
    requester: 'Tasawour',
    date: '2024-12-30',
    status: JobStatus.COMPLETED,
    priority: 'High',
    project: 'Haram',
    slaStatus: 'On Track',
    materialPriceSar: 26600,
    numberOfTrailers: 1
  },
  {
    id: 'JO-NIT-202409-0331',
    type: 'Equipment',
    title: 'Forklift 5 ton - Buhaiyrat',
    requester: 'Shahid Bashir',
    date: '2024-09-30',
    status: JobStatus.COMPLETED,
    priority: 'Medium',
    project: 'Buhaiyrat',
    slaStatus: 'On Track'
  },
  {
    id: 'JO-NIT-202502-0149',
    type: 'Transport',
    title: 'Trella - Jafurah Project',
    requester: 'Safder',
    date: '2025-02-19',
    status: JobStatus.COMPLETED,
    priority: 'High',
    project: 'Jafurah',
    slaStatus: 'On Track',
    numberOfTrailers: 1
  },
  {
    id: 'JO-NIT-202501-0848',
    type: 'Transport',
    title: 'Diyanna and Labores - NIT Facility',
    requester: 'Facility Team',
    date: '2025-01-15',
    status: JobStatus.IN_PROGRESS,
    priority: 'Medium',
    project: 'NIT',
    slaStatus: 'At Risk'
  },
  {
    id: 'JO-NIT-202411-0586',
    type: 'Equipment',
    title: 'Forklift 3 ton - Makkah',
    requester: 'Ahmed Ibrahim',
    date: '2024-11-20',
    status: JobStatus.COMPLETED,
    priority: 'Normal',
    project: 'Makkah',
    slaStatus: 'On Track'
  },
  {
    id: 'JO-NIT-202405-0121',
    type: 'Equipment',
    title: 'Forklift 7 ton - Jafurah',
    requester: 'M. SAFDR',
    date: '2024-05-22',
    status: JobStatus.COMPLETED,
    priority: 'High',
    project: 'Jafurah',
    slaStatus: 'On Track',
    materialPriceSar: 51100
  },
  {
    id: 'JO-NIT-202401-0109',
    type: 'Equipment',
    title: '50 Ton Crane - Jafurah',
    requester: 'M. SAFDR',
    date: '2024-01-22',
    status: JobStatus.COMPLETED,
    priority: 'High',
    project: 'Jafurah',
    slaStatus: 'On Track',
    materialPriceSar: 19800
  },
  {
    id: 'JO-NIT-202402-0251',
    type: 'Equipment',
    title: 'Crane 30T + 2x Forklift 3T - Alshrafiyah',
    requester: 'Eng. Yasser',
    date: '2024-02-05',
    status: JobStatus.NEW,
    priority: 'High',
    project: 'Alshrafiyah',
    slaStatus: 'At Risk'
  },
  {
    id: 'JO-NESMA-202404-1212',
    type: 'Transport',
    title: 'Boom Truck - NESMA Jeddah Aramco',
    requester: 'Tanweer',
    date: '2024-04-17',
    status: JobStatus.ASSIGNING,
    priority: 'Medium',
    project: 'NESMA Project (Jeddah)',
    slaStatus: 'At Risk'
  },
  {
    id: 'JO-NIT-202506-NEW1',
    type: 'Generator_Maintenance',
    title: '500KVA Generator Maintenance - PSSA',
    requester: 'Hassan Taher',
    date: '2025-06-28',
    status: JobStatus.IN_PROGRESS,
    priority: 'High',
    project: 'PSSA',
    slaStatus: 'On Track',
    generatorCapacityKva: 500,
    generatorMaintenanceType: 'Preventive'
  },
];

// ========================================
// REAL MRRV (Material Receipt) FROM AIRTABLE
// ========================================
export const MOCK_MRRV: MRRV[] = [
  {
    id: 'MRRV-2026-0145',
    supplier: 'Abdullah Namshan Contracting',
    date: '2026-01-22',
    warehouse: 'Riyadh Warehouse',
    value: 25000,
    status: 'Approved',
    poNumber: 'PO-2026-00145',
    rfimCreated: true
  },
  {
    id: 'MRRV-2026-0132',
    supplier: 'Metrotech Arabia Co. Ltd.',
    date: '2026-01-21',
    warehouse: 'Tabuk Warehouse',
    value: 8500,
    status: 'Approved',
    poNumber: 'PO-2026-00132',
    rfimCreated: true
  },
  {
    id: 'MRRV-2026-0150',
    supplier: 'Abdullah Namshan Contracting',
    date: '2026-01-22',
    warehouse: 'Madinah Warehouse',
    value: 45000,
    status: 'Draft',
    poNumber: 'PO-2026-00150',
    rfimRequired: true,
    rfimCreated: false
  },
  {
    id: 'MRRV-2026-0128',
    supplier: 'Almamorah Int Group Company',
    date: '2026-01-20',
    warehouse: 'Dammam Warehouse',
    value: 79000,
    status: 'Approved',
    poNumber: 'PO-2026-00128'
  },
  {
    id: 'MRRV-2025-1120',
    supplier: 'Construction Pioneer',
    date: '2025-11-20',
    warehouse: 'Makkah Warehouse',
    value: 2600,
    status: 'Inspected',
    poNumber: 'PO-2025-00289'
  },
];

// ========================================
// REAL MIRV (Material Issue) FROM AIRTABLE
// ========================================
export const MOCK_MIRV: MIRV[] = [
  {
    id: 'MIRV-2026-001',
    project: 'بوابة الدرعية 132/13.8KV #8241',
    requester: 'Eng. Mohammed',
    date: '2026-01-22',
    warehouse: 'Riyadh Warehouse',
    value: 25000,
    status: 'Approved',
    approvalLevel: 'Level 3 - Department Head',
    gatePassCreated: true
  },
  {
    id: 'MIRV-2026-002',
    project: 'شمال الثقبة 115/13.8KV',
    requester: 'Eng. Hassan',
    date: '2026-01-22',
    warehouse: 'Dammam Warehouse',
    value: 3200,
    status: 'Draft',
    approvalLevel: 'Level 1 - Storekeeper'
  },
  {
    id: 'MIRV-2026-003',
    project: 'PSSA',
    requester: 'Eng. Ahmed',
    date: '2026-01-21',
    warehouse: 'Tabuk Warehouse',
    value: 8500,
    status: 'Approved',
    approvalLevel: 'Level 2 - Logistics Manager',
    gatePassCreated: true
  },
  {
    id: 'MIRV-2026-004',
    project: 'رماح 380kV BSP 9077',
    requester: 'Eng. Khaled',
    date: '2026-01-18',
    warehouse: 'Madinah Warehouse',
    value: 45000,
    status: 'Approved',
    approvalLevel: 'Level 3 - Department Head'
  },
  {
    id: 'MIRV-2025-089',
    project: 'Jafurah',
    requester: 'M. SAFDR',
    date: '2025-12-15',
    warehouse: 'Jafurah Warehouse',
    value: 51100,
    status: 'Issued',
    approvalLevel: 'Level 2',
    gatePassCreated: true
  },
];

export const MOCK_MRV: MRV[] = [
  { id: 'MRV-2026-01', returnType: 'Surplus', date: '2026-02-02', project: 'PSSA', warehouse: 'Tabuk Warehouse', status: 'Pending', reason: 'فائض كمية من المعدات' },
  { id: 'MRV-2026-02', returnType: 'Damaged', date: '2026-01-25', project: 'بوابة الدرعية', warehouse: 'Riyadh Warehouse', status: 'Completed', reason: 'تلف أثناء النقل' },
  { id: 'MRV-2025-03', returnType: 'Surplus', date: '2025-12-20', project: 'Jafurah', warehouse: 'Jafurah Warehouse', status: 'Completed', reason: 'إنهاء المرحلة الأولى' },
];

export const MOCK_RFIM: RFIM[] = [
  { id: 'RFIM-2026-0145', mrrvId: 'MRRV-2026-0145', inspectionType: 'Visual', priority: 'Normal', status: 'Pass', inspector: 'Mahmoud Gamal' },
  { id: 'RFIM-2026-0132', mrrvId: 'MRRV-2026-0132', inspectionType: 'Functional', priority: 'Urgent', status: 'Pass', inspector: 'Hassan Taher' },
  { id: 'RFIM-2026-0150', mrrvId: 'MRRV-2026-0150', inspectionType: 'Visual', priority: 'Normal', status: 'Pending', inspector: 'Unassigned' },
  { id: 'RFIM-2026-0128', mrrvId: 'MRRV-2026-0128', inspectionType: 'Dimensional', priority: 'Critical', status: 'Conditional', inspector: 'Rabbani Mohammed', notes: 'بعض الأصناف تحتاج فحص إضافي' },
];

export const MOCK_OSD: OSDReport[] = [
  { id: 'OSD-2026-01', mrrvId: 'MRRV-2026-0150', reportType: 'Shortage', qtyAffected: 15, description: 'نقص في الكمية المستلمة', actionRequired: 'Contact Supplier', status: 'Open' },
  { id: 'OSD-2025-02', mrrvId: 'MRRV-2025-1120', reportType: 'Damage', qtyAffected: 3, description: 'تلف في العبوات الخارجية', actionRequired: 'Replace', status: 'Resolved' },
];

export const MOCK_SHIPMENTS: Shipment[] = [
  { id: 'SH-2026-01', supplier: 'Abdullah Namshan Contracting', description: 'كابلات كهربائية - بوابة الدرعية', etd: '2026-01-28', eta: '2026-02-15', port: 'Dammam', status: 'In Transit', agent: 'FastTrack Logistics', value: 150000 },
  { id: 'SH-2026-02', supplier: 'Metrotech Arabia', description: 'معدات سلامة - PSSA', etd: '2026-02-01', eta: '2026-02-20', port: 'Jeddah', status: 'New', value: 85000 },
  { id: 'SH-2026-03', supplier: 'Almamorah Int Group', description: 'حديد تسليح - شمال الثقبة', etd: '2026-01-25', eta: '2026-02-10', port: 'Dammam', status: 'Customs Clearance', agent: 'Global Clear', value: 250000 },
  { id: 'SH-2025-04', supplier: 'Construction Pioneer', description: 'قطع غيار رافعات', etd: '2025-12-15', eta: '2025-12-28', port: 'Riyadh', status: 'Delivered', value: 35000 },
];

// ========================================
// REAL PROJECTS FROM AIRTABLE
// ========================================
export const MOCK_PROJECTS: Project[] = [
  { id: 'P-8241', name: 'بوابة الدرعية 132/13.8KV #8241', client: 'SEC', manager: 'Eng. Mohammed', status: 'Active', region: 'Riyadh' },
  { id: 'P-THUQ', name: 'شمال الثقبة (مطار الظهران) 115/13.8KV', client: 'SEC', manager: 'Eng. Hassan', status: 'Active', region: 'Eastern' },
  { id: 'P-PSSA', name: 'PSSA - Neom Mountain', client: 'NEOM', manager: 'Eng. Ahmed', status: 'Active', region: 'Tabuk' },
  { id: 'P-RUMAH', name: 'رماح 380kV BSP 9077', client: 'SEC', manager: 'Eng. Khaled', status: 'Active', region: 'Riyadh' },
  { id: 'P-JAFURAH', name: 'Jafurah Gas Project', client: 'Aramco', manager: 'M. SAFDR', status: 'Active', region: 'Eastern' },
  { id: 'P-NEOM-OM', name: 'O&M Security Systems - NEOM', client: 'NEOM', manager: 'Eng. Saeed', status: 'Active', region: 'Tabuk' },
  { id: 'P-ALMURJAN', name: 'ALMURJAN', client: 'Private', manager: 'Ahmed Tosson', status: 'Active', region: 'Riyadh' },
  { id: 'P-HARAM', name: 'Haram Expansion', client: 'Government', manager: 'Tasawour', status: 'Active', region: 'Makkah' },
];

// ========================================
// REAL WAREHOUSES WITH GPS COORDINATES
// ========================================
export const AIRTABLE_WAREHOUSES = [
  { id: 'WH-01', name: 'Dammam Warehouse', city: 'Dammam', lat: 26.4207, lng: 50.0888 },
  { id: 'WH-02', name: 'Riyadh Warehouse', city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { id: 'WH-03', name: 'Jeddah Warehouse', city: 'Jeddah', lat: 21.5433, lng: 39.1728 },
  { id: 'WH-04', name: 'Makkah Warehouse', city: 'Makkah', lat: 21.4225, lng: 39.8262 },
  { id: 'WH-05', name: 'Madinah Warehouse (1)', city: 'Madinah', lat: 24.5247, lng: 39.5692 },
  { id: 'WH-06', name: 'Tabuk Warehouse (PSSA)', city: 'Tabuk', lat: 28.3838, lng: 36.5650 },
  { id: 'WH-07', name: 'Jubail Warehouse', city: 'Jubail', lat: 27.0046, lng: 49.6225 },
  { id: 'WH-08', name: 'Hafir Albatin Warehouse', city: 'Hafir Albatin', lat: 28.4328, lng: 45.9619 },
  { id: 'WH-09', name: 'Jafurah Warehouse', city: 'Jafurah', lat: 24.7500, lng: 49.5000 },
  { id: 'WH-10', name: 'Asfan Warehouse', city: 'Asfan', lat: 21.8833, lng: 39.4500 },
  { id: 'WH-11', name: 'Jizan Warehouse', city: 'Jizan', lat: 16.8893, lng: 42.5706 },
  { id: 'WH-12', name: 'Rabigh Warehouse', city: 'Rabigh', lat: 22.8000, lng: 39.0333 },
  { id: 'WH-13', name: 'Buraida Warehouse', city: 'Buraida', lat: 26.3260, lng: 43.9750 },
];

// ========================================
// REAL SUPPLIERS FROM AIRTABLE
// ========================================
export const AIRTABLE_SUPPLIERS = [
  { id: 'SUP-01', name: 'Abdullah Namshan Contracting Company', city: 'Jubail', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-02', name: 'Metrotech Arabia Co. Ltd.', city: 'Jeddah', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-03', name: 'Almamorah Int Group Company', city: 'Jeddah', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-04', name: 'Construction Pioneer', city: 'Dammam', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-05', name: 'Awtad Alsharq', city: 'Riyadh', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-06', name: 'Sanaa CO', city: 'Jeddah', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-07', name: 'Al-Buraq CO', city: 'Riyadh', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-08', name: 'Zad Al-Omran', city: 'Farasan', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-09', name: 'REDA Safe Trading', city: 'Dammam', type: 'LOCAL SUPPLIER', status: 'Active' },
  { id: 'SUP-10', name: 'First Arab General Contracting', city: 'Jeddah', type: 'LOCAL SUPPLIER', status: 'Active' },
];

// ========================================
// REAL EMPLOYEES FROM AIRTABLE
// ========================================
export const AIRTABLE_EMPLOYEES = [
  { id: 'EMP-01', name: 'Rabbani Mohammed Gulam', department: 'Warehouse', title: 'Storekeeper', site: 'Dammam' },
  { id: 'EMP-02', name: 'Mahmoud Gamal Mohamed', department: 'Warehouse', title: 'Warehouses Supervisor', site: 'Jeddah' },
  { id: 'EMP-03', name: 'Hassan Taher Amer', department: 'Logistics', title: 'Logistics Officer', site: 'Riyadh' },
  { id: 'EMP-04', name: 'Mohammed Gharim Alamri', department: 'Logistics', title: 'Supply Chain Business Partner', site: 'Abha' },
  { id: 'EMP-05', name: 'Mahmoud Abdelshafy', department: 'Warehouse', title: 'Storekeeper', site: 'Riyadh' },
  { id: 'EMP-06', name: 'Ali Mohammad Arif', department: 'Warehouse', title: 'Vehicles Mechanic', site: 'Jeddah' },
  { id: 'EMP-07', name: 'Sulafa Adel Pasha', department: 'Insurance', title: 'Insurance Specialist', site: 'Jeddah' },
  { id: 'EMP-08', name: 'Allauddin Ali', department: 'Transport', title: 'Driver', site: 'Jeddah' },
];

// ========================================
// MAP DATA - REAL LOCATIONS IN KSA
// ========================================
export const MAP_LOCATIONS = [
  // Active Projects (Real from Airtable)
  {
    id: 'P-8241',
    name: 'بوابة الدرعية 132/13.8KV #8241',
    type: 'Project',
    lat: 24.7340,
    lng: 46.5769,
    details: 'SEC Substation - Contract: 155M SAR - 45% Complete',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'P-THUQ',
    name: 'شمال الثقبة (مطار الظهران)',
    type: 'Project',
    lat: 26.4700,
    lng: 50.0517,
    details: 'SEC 115/13.8KV - Contract: 79M SAR - 55% Billed',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'P-PSSA',
    name: 'PSSA - Neom Mountain',
    type: 'Project',
    lat: 28.1400,
    lng: 34.8000,
    details: 'NEOM - Heavy machinery deployed',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'P-RUMAH',
    name: 'رماح 380kV BSP 9077',
    type: 'Project',
    lat: 25.5700,
    lng: 45.3000,
    details: 'SEC - Contract: 914M SAR - Starting Phase',
    image: 'https://images.unsplash.com/photo-1583023069158-692795db2836?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'P-JAFURAH',
    name: 'Jafurah Gas Project',
    type: 'Project',
    lat: 24.7500,
    lng: 49.5000,
    details: 'Aramco - Active Job Orders',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010c2?q=80&w=400&auto=format&fit=crop'
  },

  // Warehouses (Real from Airtable)
  {
    id: 'WH-01',
    name: 'Dammam Warehouse (Tarshid)',
    type: 'Warehouse',
    lat: 26.4207,
    lng: 50.0888,
    details: 'Central Hub - Capacity: 90% Full. Main receiving center.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'WH-02',
    name: 'Riyadh Logistics Hub',
    type: 'Warehouse',
    lat: 24.7136,
    lng: 46.6753,
    details: 'Distribution Center - Capacity: 65% Full.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'WH-03',
    name: 'Jeddah Warehouse',
    type: 'Warehouse',
    lat: 21.5433,
    lng: 39.1728,
    details: 'Western Region Hub - Import/Export.',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'WH-06',
    name: 'Tabuk Warehouse (PSSA)',
    type: 'Warehouse',
    lat: 28.3838,
    lng: 36.5650,
    details: 'NEOM Support - Safety Equipment.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop'
  },

  // Active Equipment (from Job Orders)
  {
    id: 'EQ-01',
    name: 'Boom Truck 10T (Haram)',
    type: 'Equipment',
    lat: 21.4225,
    lng: 39.8262,
    details: 'JO-NIT-202506-0462 - Active',
    image: 'https://images.unsplash.com/photo-1580901369227-3932a2651475?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'EQ-02',
    name: 'Forklift 5T (ALMURJAN)',
    type: 'Equipment',
    lat: 24.8000,
    lng: 46.7500,
    details: 'JO-NIT-202504-0230 - Completed',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop'
  },

  // Fleet/Transport
  {
    id: 'FLEET-01',
    name: 'Fleet Convoy - Jafurah Route',
    type: 'Employee',
    lat: 25.5000,
    lng: 48.0000,
    details: 'En route: Dammam → Jafurah. Material Delivery.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400&auto=format&fit=crop'
  },
];

// NAVIGATION - SINGLE SOURCE OF TRUTH
export const NAVIGATION_LINKS: Record<UserRole, NavItem[]> = {
  [UserRole.ADMIN]: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'SLA Dashboard', path: '/admin/sla', icon: PieChart },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Live Map', path: '/admin/map', icon: Map },
    {
      label: 'Operation Forms',
      icon: FilePlus,
      children: [
        { label: 'Issue Request (MIRV)', path: '/admin/forms/mirv', icon: FileText },
        { label: 'Material Receipt (MRRV)', path: '/admin/forms/mrrv', icon: FileText },
        { label: 'Inspection Request (RFIM)', path: '/admin/forms/rfim', icon: Shield },
        { label: 'OSD Report', path: '/admin/forms/osd', icon: AlertTriangle },
        { label: 'Material Return (MRV)', path: '/admin/forms/mrv', icon: RefreshCw },
        { label: 'Job Order', path: '/admin/forms/jo', icon: Truck },
      ]
    },
    {
      label: 'Warehouses',
      icon: Package,
      children: [
        { label: 'Receipt Vouchers (MRRV)', path: '/admin/warehouse/mrrv', icon: ArrowDownCircle },
        { label: 'Issue Vouchers (MIRV)', path: '/admin/warehouse/mirv', icon: ArrowUpCircle },
        { label: 'Return Vouchers (MRV)', path: '/admin/warehouse/mrv', icon: RefreshCw },
        { label: '─────────────', type: 'divider', icon: Box },
        { label: 'Inventory Levels', path: '/admin/warehouse/inventory', icon: Box },
        { label: 'Gate Passes', path: '/admin/warehouse/gate-pass', icon: LogOut },
        { label: 'Stock Transfers', path: '/admin/warehouse/stock-transfer', icon: RefreshCw },
      ]
    },
    {
      label: 'Transport & Equipment',
      icon: Truck,
      children: [
        { label: 'Job Orders Board', path: '/admin/transport/board', icon: ClipboardList },
        { label: 'All Job Orders', path: '/admin/transport/job-orders', icon: Truck },
        { label: '─────────────', type: 'divider', icon: Box },
        { label: 'Fleet Management', path: '/admin/transport/fleet', icon: Truck },
        { label: 'Suppliers', path: '/admin/transport/suppliers', icon: Users },
      ]
    },
    {
      label: 'Shipping & Customs',
      icon: Ship,
      children: [
        { label: 'Shipments', path: '/admin/shipping/shipments', icon: Package },
        { label: 'Customs Clearance', path: '/admin/shipping/customs', icon: FileCheck },
        { label: 'Shipping Reports', path: '/admin/shipping/reports', icon: BarChart3 },
      ]
    },
    {
      label: 'Quality (QC)',
      icon: Shield,
      children: [
        { label: 'Inspection Requests (RFIM)', path: '/admin/quality/rfim', icon: FileCheck },
        { label: 'OSD Reports', path: '/admin/quality/osd', icon: AlertTriangle },
      ]
    },
    {
      label: 'Management',
      icon: Settings,
      children: [
        { label: 'Employees', path: '/admin/management/employees', icon: Users },
        { label: 'Projects', path: '/admin/management/projects', icon: Box },
        { label: 'Roles & Permissions', path: '/admin/management/roles', icon: Shield },
      ]
    },
    {
      label: 'Reports',
      path: '/admin/reports',
      icon: FileText,
      children: [
        { label: 'Inventory Report', path: '/admin/reports/inventory', icon: BarChart3 },
        { label: 'Job Orders Report', path: '/admin/reports/job-orders', icon: BarChart3 },
        { label: 'SLA Report', path: '/admin/reports/sla', icon: BarChart3 },
        { label: 'Financial Report', path: '/admin/reports/financial', icon: BarChart3 },
      ]
    },
  ],
  [UserRole.WAREHOUSE]: [
    { label: 'Dashboard', path: '/warehouse', icon: LayoutDashboard },
    { label: 'Receive (MRRV)', path: '/warehouse/receive', icon: ArrowDownCircle },
    { label: 'Issue (MIRV)', path: '/warehouse/issue', icon: ArrowUpCircle },
    { label: 'Inventory', path: '/warehouse/inventory', icon: Package },
    { label: 'Return', path: '/warehouse/return', icon: RefreshCw },
  ],
  [UserRole.TRANSPORT]: [
    { label: 'Dashboard', path: '/transport', icon: LayoutDashboard },
    { label: 'Job Orders', path: '/transport/jobs', icon: ClipboardList },
    { label: 'Fleet', path: '/transport/fleet', icon: Truck },
    { label: 'Suppliers', path: '/transport/suppliers', icon: Users },
  ],
  [UserRole.ENGINEER]: [
    { label: 'Dashboard', path: '/engineer', icon: LayoutDashboard },
    { label: 'New Request', path: '/engineer/new', icon: ClipboardList },
    { label: 'My Requests', path: '/engineer/my-requests', icon: FileCheck },
    { label: 'My Project', path: '/engineer/project', icon: Box },
  ]
};
