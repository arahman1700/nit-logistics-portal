-- NIT Logistics Portal - Database Schema
-- Create all tables for the logistics management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'engineer' CHECK (role IN ('admin', 'warehouse', 'transport', 'engineer')),
  department TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  client TEXT,
  manager TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'On Hold')),
  region TEXT,
  contract_value DECIMAL(15,2),
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WAREHOUSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  lat DECIMAL(10,6),
  lng DECIMAL(10,6),
  capacity_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUPPLIERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  type TEXT DEFAULT 'LOCAL SUPPLIER',
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Blacklisted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INVENTORY ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  category TEXT,
  warehouse_id UUID REFERENCES public.warehouses(id),
  quantity INTEGER DEFAULT 0,
  reserved INTEGER DEFAULT 0,
  on_order INTEGER DEFAULT 0,
  min_level INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  unit_price DECIMAL(10,2),
  location TEXT,
  stock_status TEXT DEFAULT 'In Stock' CHECK (stock_status IN ('In Stock', 'Low Stock', 'Out of Stock')),
  last_movement TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- JOB ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.job_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Transport', 'Equipment', 'Generator_Rental', 'Generator_Maintenance', 'Rental_Monthly', 'Rental_Daily', 'Scrap')),
  title TEXT NOT NULL,
  requester_id UUID REFERENCES public.profiles(id),
  requester_name TEXT,
  request_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Assigning', 'In Progress', 'Completed', 'Cancelled')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  project_id UUID REFERENCES public.projects(id),
  sla_status TEXT DEFAULT 'On Track' CHECK (sla_status IN ('On Track', 'At Risk', 'Overdue')),
  vehicle TEXT,
  driver TEXT,
  
  -- Transport specific
  cargo_type TEXT,
  cargo_weight_tons DECIMAL(10,2),
  number_of_trips INTEGER,
  number_of_trailers INTEGER,
  material_price_sar DECIMAL(15,2),
  insurance_required BOOLEAN DEFAULT FALSE,
  entry_permit_required BOOLEAN DEFAULT FALSE,
  entry_permit_status TEXT,
  include_loading_equipment BOOLEAN DEFAULT FALSE,
  loading_equipment_type TEXT,
  
  -- Rental specific
  rental_duration TEXT,
  rental_start_date DATE,
  rental_end_date DATE,
  monthly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  with_operator BOOLEAN DEFAULT FALSE,
  
  -- Generator specific
  generator_capacity_kva INTEGER,
  generator_maintenance_type TEXT,
  generator_issue_description TEXT,
  
  -- Location
  pickup_location_url TEXT,
  delivery_location_url TEXT,
  pickup_contact_name TEXT,
  pickup_contact_phone TEXT,
  delivery_contact_name TEXT,
  delivery_contact_phone TEXT,
  
  -- Approval
  quote_amount DECIMAL(15,2),
  quote_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MRRV (Material Receipt Report Voucher)
-- =============================================
CREATE TABLE IF NOT EXISTS public.mrrv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  supplier_name TEXT,
  receipt_date DATE DEFAULT CURRENT_DATE,
  warehouse_id UUID REFERENCES public.warehouses(id),
  total_value DECIMAL(15,2),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Inspected', 'Pending QC')),
  po_number TEXT,
  delivery_note TEXT,
  received_by UUID REFERENCES public.profiles(id),
  rfim_required BOOLEAN DEFAULT FALSE,
  rfim_created BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MIRV (Material Issue Request Voucher)
-- =============================================
CREATE TABLE IF NOT EXISTS public.mirv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  project_name TEXT,
  requester_id UUID REFERENCES public.profiles(id),
  requester_name TEXT,
  request_date DATE DEFAULT CURRENT_DATE,
  warehouse_id UUID REFERENCES public.warehouses(id),
  estimated_value DECIMAL(15,2),
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Issued')),
  approval_level TEXT,
  gate_pass_created BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MRV (Material Return Voucher)
-- =============================================
CREATE TABLE IF NOT EXISTS public.mrv (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_number TEXT UNIQUE NOT NULL,
  return_type TEXT NOT NULL CHECK (return_type IN ('Surplus', 'Damaged', 'Wrong Item', 'Project_Complete')),
  return_date DATE DEFAULT CURRENT_DATE,
  project_id UUID REFERENCES public.projects(id),
  warehouse_id UUID REFERENCES public.warehouses(id),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Completed')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RFIM (Request for Inspection of Material)
-- =============================================
CREATE TABLE IF NOT EXISTS public.rfim (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_number TEXT UNIQUE NOT NULL,
  mrrv_id UUID REFERENCES public.mrrv(id),
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('Visual', 'Dimensional', 'Functional', 'Documentation')),
  priority TEXT DEFAULT 'Normal' CHECK (priority IN ('Normal', 'Urgent', 'Critical')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Pass', 'Fail', 'Conditional')),
  inspector_id UUID REFERENCES public.profiles(id),
  inspector_name TEXT,
  inspection_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SHIPMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number TEXT UNIQUE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  supplier_name TEXT,
  description TEXT,
  etd DATE,
  eta DATE,
  port TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'In Transit', 'Customs Clearance', 'In Clearance', 'Delivered')),
  agent TEXT,
  value DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  user_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mrrv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mrv ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfim ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Warehouses policies
CREATE POLICY "Authenticated users can view warehouses" ON public.warehouses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage warehouses" ON public.warehouses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Suppliers policies
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage suppliers" ON public.suppliers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Inventory policies
CREATE POLICY "Authenticated users can view inventory" ON public.inventory_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Warehouse staff can manage inventory" ON public.inventory_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'warehouse'))
);

-- Job orders policies
CREATE POLICY "Authenticated users can view job orders" ON public.job_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create job orders" ON public.job_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins and transport can update job orders" ON public.job_orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'transport'))
);

-- MRRV policies
CREATE POLICY "Authenticated users can view mrrv" ON public.mrrv FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Warehouse staff can manage mrrv" ON public.mrrv FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'warehouse'))
);

-- MIRV policies
CREATE POLICY "Authenticated users can view mirv" ON public.mirv FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create mirv" ON public.mirv FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse can update mirv" ON public.mirv FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'warehouse'))
);

-- MRV policies
CREATE POLICY "Authenticated users can view mrv" ON public.mrv FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create mrv" ON public.mrv FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Warehouse staff can update mrv" ON public.mrv FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'warehouse'))
);

-- RFIM policies
CREATE POLICY "Authenticated users can view rfim" ON public.rfim FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and warehouse can manage rfim" ON public.rfim FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'warehouse'))
);

-- Shipments policies
CREATE POLICY "Authenticated users can view shipments" ON public.shipments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage shipments" ON public.shipments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Activity logs policies
CREATE POLICY "Authenticated users can view activity logs" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_orders_updated_at BEFORE UPDATE ON public.job_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mrrv_updated_at BEFORE UPDATE ON public.mrrv FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mirv_updated_at BEFORE UPDATE ON public.mirv FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mrv_updated_at BEFORE UPDATE ON public.mrv FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfim_updated_at BEFORE UPDATE ON public.rfim FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'engineer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
