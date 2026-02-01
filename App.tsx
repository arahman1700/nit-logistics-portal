
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminResourceList } from './pages/AdminResourceList';
import { WarehouseDashboard } from './pages/WarehouseDashboard';
import { TransportDashboard } from './pages/TransportDashboard';
import { EngineerDashboard } from './pages/EngineerDashboard';
import { ResourceForm } from './pages/ResourceForm';
import { SlaDashboard } from './pages/SlaDashboard';
import { PaymentsDashboard } from './pages/PaymentsDashboard';
import { RfimList } from './pages/quality/RfimList';
import { JobOrdersKanban } from './pages/transport/JobOrdersKanban';
import { MapDashboard } from './pages/MapDashboard';
import { UserRole } from './types';
import { MOCK_USERS } from './constants';

const Layout: React.FC<{ children: React.ReactNode, role: UserRole, setRole: (r: UserRole) => void }> = ({ children, role, setRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile route change
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle Role Switching Redirection
  useEffect(() => {
    const basePath = location.pathname.split('/')[1];
    let expectedPath = 'admin';
    
    if (role === UserRole.WAREHOUSE) expectedPath = 'warehouse';
    if (role === UserRole.TRANSPORT) expectedPath = 'transport';
    if (role === UserRole.ENGINEER) expectedPath = 'engineer';

    if (basePath !== expectedPath) {
      navigate(`/${expectedPath}`);
    }
  }, [role, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-nesma-dark to-[#051020] text-white font-sans">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed on Mobile, Relative on Desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
        <Sidebar 
          role={role} 
          isOpen={isSidebarOpen} 
          setRole={setRole}
          isMobile={window.innerWidth <= 1024}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 w-full">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          user={MOCK_USERS.find(u => u.role === role)!}
          role={role}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 relative scroll-smooth">
          {/* Background Particles/Effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>
          <div className="relative z-10 min-h-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);

  return (
    <HashRouter>
      <Layout role={currentRole} setRole={setCurrentRole}>
        <Routes>
          <Route path="/" element={
            currentRole === UserRole.ADMIN ? <Navigate to="/admin" /> :
            currentRole === UserRole.WAREHOUSE ? <Navigate to="/warehouse" /> :
            currentRole === UserRole.TRANSPORT ? <Navigate to="/transport" /> :
            <Navigate to="/engineer" />
          } />
          
          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/sla" element={<SlaDashboard />} />
          <Route path="/admin/payments" element={<PaymentsDashboard />} />
          <Route path="/admin/map" element={<MapDashboard />} />
          <Route path="/admin/quality/rfim" element={<RfimList />} />
          <Route path="/admin/transport/board" element={<JobOrdersKanban />} />
          <Route path="/admin/:section/:resource" element={<AdminResourceList />} />
          <Route path="/admin/forms/:formType" element={<ResourceForm />} />
          
          {/* WAREHOUSE ROUTES */}
          <Route path="/warehouse" element={<WarehouseDashboard />} />
          <Route path="/warehouse/:tab" element={<WarehouseDashboard />} />

          {/* TRANSPORT ROUTES */}
          <Route path="/transport" element={<TransportDashboard />} />
          <Route path="/transport/:view" element={<TransportDashboard />} />

          {/* ENGINEER ROUTES */}
          <Route path="/engineer" element={<EngineerDashboard />} />
          <Route path="/engineer/*" element={<EngineerDashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
