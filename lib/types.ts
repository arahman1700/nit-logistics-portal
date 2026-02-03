export type UserRole = "admin" | "warehouse" | "transport" | "engineer"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  department: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  code: string
  location: string | null
  client: string | null
  status: "active" | "completed" | "on_hold"
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface Warehouse {
  id: string
  name: string
  location: string | null
  capacity: number | null
  current_stock: number
  manager_id: string | null
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  rating: number
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string | null
  unit: string
  quantity: number
  min_quantity: number
  unit_price: number
  warehouse_id: string | null
  supplier_id: string | null
  created_at: string
  updated_at: string
  warehouse?: Warehouse
  supplier?: Supplier
}

export type JobOrderStatus = "pending" | "approved" | "in_progress" | "completed" | "cancelled"
export type JobOrderType = "material_request" | "transfer" | "return" | "inspection"

export interface JobOrder {
  id: string
  order_number: string
  type: JobOrderType
  status: JobOrderStatus
  priority: "low" | "medium" | "high" | "urgent"
  project_id: string | null
  requested_by: string | null
  approved_by: string | null
  description: string | null
  notes: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  project?: Project
  requester?: Profile
  approver?: Profile
}

export type DocumentStatus = "draft" | "pending" | "approved" | "rejected"

export interface MRRV {
  id: string
  document_number: string
  status: DocumentStatus
  job_order_id: string | null
  supplier_id: string | null
  warehouse_id: string | null
  received_by: string | null
  received_date: string | null
  total_amount: number
  notes: string | null
  created_at: string
  job_order?: JobOrder
  supplier?: Supplier
  warehouse?: Warehouse
}

export interface MIRV {
  id: string
  document_number: string
  status: DocumentStatus
  job_order_id: string | null
  warehouse_id: string | null
  issued_by: string | null
  issued_to: string | null
  issue_date: string | null
  total_amount: number
  notes: string | null
  created_at: string
  job_order?: JobOrder
  warehouse?: Warehouse
}

export interface MRV {
  id: string
  document_number: string
  status: DocumentStatus
  job_order_id: string | null
  warehouse_id: string | null
  returned_by: string | null
  return_date: string | null
  reason: string | null
  total_amount: number
  notes: string | null
  created_at: string
  job_order?: JobOrder
  warehouse?: Warehouse
}

export interface RFIM {
  id: string
  document_number: string
  status: DocumentStatus
  job_order_id: string | null
  project_id: string | null
  requested_by: string | null
  urgency: "low" | "medium" | "high" | "critical"
  justification: string | null
  estimated_cost: number
  approved_cost: number | null
  notes: string | null
  created_at: string
  job_order?: JobOrder
  project?: Project
}

export type ShipmentStatus = "preparing" | "in_transit" | "delivered" | "delayed" | "cancelled"

export interface Shipment {
  id: string
  tracking_number: string
  status: ShipmentStatus
  job_order_id: string | null
  origin_warehouse_id: string | null
  destination: string | null
  carrier: string | null
  estimated_delivery: string | null
  actual_delivery: string | null
  driver_name: string | null
  driver_phone: string | null
  vehicle_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
  job_order?: JobOrder
  origin_warehouse?: Warehouse
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  link: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  user?: Profile
}

export interface DashboardStats {
  totalJobOrders: number
  pendingJobOrders: number
  completedJobOrders: number
  totalInventoryItems: number
  lowStockItems: number
  totalShipments: number
  inTransitShipments: number
  totalProjects: number
  activeProjects: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}
