export enum UserRole {
  ADMIN = 'Admin',
  WAREHOUSE = 'Warehouse Staff',
  TRANSPORT = 'Transport Staff',
  ENGINEER = 'Engineer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export enum JobStatus {
  NEW = 'New',
  ASSIGNING = 'Assigning',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface JobOrder {
  id: string;
  // Updated types based on implementation guide (22 Jan Update)
  type: 'Transport' | 'Equipment' | 'Generator_Rental' | 'Generator_Maintenance' | 'Rental_Monthly' | 'Rental_Daily' | 'Scrap';
  title: string;
  requester: string;
  date: string; // Request Date
  status: JobStatus;
  priority: 'High' | 'Medium' | 'Low';
  project?: string;
  slaStatus?: 'On Track' | 'At Risk' | 'Overdue';
  vehicle?: string;
  driver?: string;

  // --- NEW FIELDS FROM GUIDE (21 Jan Update) ---
  
  // Common
  cnNumber?: string;
  requesterPosition?: string;
  requesterPhone?: string;
  requesterNationalId?: string;
  pickupLocationUrl?: string;
  deliveryLocationUrl?: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  deliveryContactName?: string;
  deliveryContactPhone?: string;
  arrivingDateTime?: string;
  shiftStartTime?: string;

  // Transport
  materialPriceSar?: number;
  insuranceRequired?: boolean;
  numberOfTrailers?: number;
  entryPermitRequired?: boolean;
  entryPermitStatus?: 'Pending' | 'Approved' | 'Rejected';
  includeLoadingEquipment?: boolean;
  loadingEquipmentType?: string;
  cargoType?: string;
  cargoWeightTons?: number;
  numberOfTrips?: number;

  // Rental
  rentalDuration?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  monthlyRate?: number;
  dailyRate?: number;
  withOperator?: boolean;

  // Scrap
  scrapType?: string;
  scrapWeightTons?: number;
  scrapDestination?: string;
  scrapDescription?: string;

  // Generator
  generatorCapacityKva?: number;
  generatorMaintenanceType?: string;
  generatorIssueDescription?: string;

  // Approval & Verification
  storekeeperEmployee?: string;
  safetyEngineerEmployee?: string;
  overtimeApproval?: boolean;
  overtimeHours?: number;
  pmSignatureRequired?: boolean;
  pmSignatureDate?: string;
  quoteAmount?: number;
  quoteApproved?: boolean;
  quoteApprovedDate?: string;
  cooApprovalRequired?: boolean;
  cooApproved?: boolean;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string; // Item_Description
  warehouse: string;
  quantity: number; // Qty_Available
  reserved: number; // Qty_Reserved
  onOrder: number; // Qty_On_Order
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  minLevel: number;
  reorderPoint?: number;
  category: string;
  location: string;
  lastMovement?: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  action: string;
  user: string;
  details: string;
  type: 'success' | 'warning' | 'info';
}

export interface StatMetric {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
}

export interface NavItem {
  label: string;
  path?: string;
  icon: any;
  children?: NavItem[];
  type?: 'link' | 'dropdown' | 'divider';
}

export interface MRRV {
  id: string;
  formNumber?: string; // N-MS-NIT-LSS-FRM-0101
  supplier: string;
  date: string;
  warehouse: string;
  value: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Inspected' | 'Pending QC';
  poNumber?: string;
  deliveryNote?: string;
  receivedBy?: string;
  rfimRequired?: boolean;
  rfimCreated?: boolean;
}

export interface MIRV {
  id: string;
  formNumber?: string; // N-MS-NIT-LSS-FRM-0102
  project: string;
  requester: string;
  date: string;
  warehouse: string;
  value: number; // Estimated Value
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Issued';
  approvalLevel?: string; // Calculated
  gatePassCreated?: boolean;
}

export interface MRV {
  id: string;
  formNumber?: string; // N-MS-NIT-LSS-FRM-0103
  returnType: 'Surplus' | 'Damaged' | 'Wrong Item' | 'Project_Complete';
  date: string;
  project: string;
  warehouse: string;
  status: 'Pending' | 'Approved' | 'Completed';
  reason?: string;
}

export interface RFIM {
  id: string; // RFIM-xxxx
  formNumber?: string; // N-MS-NIT-LSS-FRM-0105
  mrrvId: string;
  inspectionType: 'Visual' | 'Dimensional' | 'Functional' | 'Documentation';
  priority: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending' | 'Pass' | 'Fail' | 'Conditional';
  inspector?: string;
  notes?: string;
}

export interface OSDReport {
  id: string;
  formNumber?: string; // N-MS-NIT-LSS-FRM-0108
  mrrvId: string;
  reportType: 'Over' | 'Short' | 'Damage';
  qtyAffected: number;
  description: string;
  actionRequired: 'RMS' | 'Credit' | 'Replace';
  status: 'Open' | 'Resolved';
}

export interface Shipment {
  id: string;
  supplier: string;
  description?: string;
  etd: string;
  eta: string;
  port: string;
  status: 'New' | 'In Transit' | 'Customs Clearance' | 'Delivered' | 'In Clearance';
  agent?: string;
  value?: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  manager: string;
  status: 'Active' | 'Completed' | 'On Hold';
  region?: string;
}