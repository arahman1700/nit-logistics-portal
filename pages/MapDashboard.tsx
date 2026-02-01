import React, { useEffect, useState, useRef } from 'react';
import { MAP_LOCATIONS } from '../constants';
import { Filter, Map as MapIcon, Layers, Maximize, Search, ChevronRight, Navigation } from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

export const MapDashboard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<'dark' | 'satellite'>('dark');

  // Filters
  const [filters, setFilters] = useState({
    Project: true,
    Warehouse: true,
    Equipment: true,
    Employee: true
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Fly to location function
  const flyToLocation = (loc: any) => {
    if (!mapInstanceRef.current) return;
    
    setSelectedLocation(loc);
    mapInstanceRef.current.flyTo([loc.lat, loc.lng], 12, {
      duration: 2,
      easeLinearity: 0.25
    });

    // Find and open popup
    const marker = markersRef.current.find(m => m.options.id === loc.id);
    if (marker) {
      setTimeout(() => marker.openPopup(), 2200); // Open after animation
    }
  };

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Initialize Map if not already done
    if (!mapInstanceRef.current) {
      // Create Map
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([24.7136, 46.6753], 6); // Centered on Saudi Arabia

      // Custom Zoom Control to bottom right
      window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Layer Handling
    map.eachLayer((layer: any) => {
       if (layer._url) map.removeLayer(layer);
    });

    if (activeLayer === 'dark') {
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);
    } else {
      // Simulated Satellite (using OpenTopo or similar free one for demo, or hybrid)
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);
    }

    // Update Markers
    // Clear existing
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Define Custom Icons
    const getIcon = (type: string) => {
        let color = '#B3B3B3';
        let iconHtml = '';
        
        switch(type) {
            case 'Project': 
                color = '#2E3192'; // Primary
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8H7v8"/></svg>`;
                break;
            case 'Warehouse': 
                color = '#F59E0B'; // Amber
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
                break;
            case 'Equipment': 
                color = '#10B981'; // Emerald
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
                break;
            case 'Employee': 
                color = '#EF4444'; // Red
                iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                break;
        }

        return window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin" style="background-color: ${color}; width: 44px; height: 44px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); cursor: pointer;">
                      <div style="transform: rotate(45deg);">${iconHtml}</div>
                   </div>`,
            iconSize: [44, 44],
            iconAnchor: [22, 44],
            popupAnchor: [0, -48]
        });
    };

    // Add Markers based on filters
    MAP_LOCATIONS.forEach(loc => {
        if (filters[loc.type as keyof typeof filters]) {
            const marker = window.L.marker([loc.lat, loc.lng], { 
                icon: getIcon(loc.type),
                id: loc.id // Custom prop to find later
            }).addTo(map);
            
            const popupContent = `
                <div class="min-w-[240px] font-sans">
                    <div class="h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-900 border border-white/10 relative">
                        <img src="${loc.image}" class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700" alt="${loc.name}" />
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                             <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-nesma-secondary/20 text-nesma-secondary border border-nesma-secondary/30 backdrop-blur-sm">${loc.type}</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-lg mb-1 text-white leading-tight">${loc.name}</h3>
                    <div class="flex items-center gap-1 text-gray-400 text-xs mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                       <span>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</span>
                    </div>
                    <p class="text-sm text-gray-300 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">${loc.details}</p>
                    <div class="flex gap-2 mt-3">
                        <button class="flex-1 bg-nesma-primary hover:bg-nesma-accent text-white py-2 rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-nesma-primary/40">Open Profile</button>
                        <button class="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white border border-white/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                closeButton: false,
                maxWidth: 280
            });
            
            markersRef.current.push(marker);
        }
    });

  }, [filters, activeLayer]);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] animate-fade-in">
      {/* Sidebar List */}
      <div className="w-80 glass-card rounded-2xl flex flex-col overflow-hidden hidden lg:flex border border-white/10 shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-white/5">
           <h3 className="font-bold text-white mb-3">Active Assets</h3>
           <div className="relative">
             <Search size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
             <input type="text" placeholder="Find project, truck..." className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-nesma-secondary" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {MAP_LOCATIONS.map(loc => (
                <div 
                  key={loc.id} 
                  onClick={() => flyToLocation(loc)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border group ${selectedLocation?.id === loc.id ? 'bg-nesma-primary/20 border-nesma-primary/50' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'}`}
                >
                   <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={loc.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold truncate ${selectedLocation?.id === loc.id ? 'text-nesma-secondary' : 'text-gray-200 group-hover:text-white'}`}>{loc.name}</h4>
                            <span className={`text-[10px] px-1.5 rounded ${selectedLocation?.id === loc.id ? 'bg-nesma-primary text-white' : 'bg-white/10 text-gray-400'}`}>{loc.type}</span>
                         </div>
                         <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 truncate">
                            <Navigation size={10} />
                            <span>{loc.id}</span>
                         </div>
                      </div>
                   </div>
                </div>
            ))}
        </div>
        
        <div className="p-4 border-t border-white/10 text-xs text-gray-500 text-center bg-black/20">
            {MAP_LOCATIONS.length} Active locations in Kingdom
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
        
        {/* Floating Controls */}
        <div className="absolute top-4 left-4 z-[400] bg-[#0E2841]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <Filter size={16} className="text-nesma-secondary" />
                <span className="font-bold text-white text-sm">Asset Filters</span>
            </div>
            <div className="space-y-2">
                {Object.keys(filters).map(key => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group/filter">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters[key as keyof typeof filters] ? 'bg-nesma-secondary border-nesma-secondary' : 'border-gray-500 bg-transparent'}`}>
                            {filters[key as keyof typeof filters] && <div className="w-2 h-2 bg-[#0E2841] rounded-sm"></div>}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={filters[key as keyof typeof filters]} 
                            onChange={() => toggleFilter(key as keyof typeof filters)} 
                        />
                        <span className="text-sm text-gray-300 group-hover/filter:text-white transition-colors">{key}s</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
           <button 
             onClick={() => setActiveLayer(activeLayer === 'dark' ? 'satellite' : 'dark')}
             className="p-3 bg-[#0E2841]/90 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-nesma-primary hover:text-white hover:border-nesma-secondary/50 transition-all shadow-xl group/btn"
             title="Toggle Satellite"
           >
               <Layers size={20} className={activeLayer === 'satellite' ? 'text-nesma-secondary' : 'text-gray-300'} />
           </button>
           <button className="p-3 bg-[#0E2841]/90 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-nesma-primary hover:text-white hover:border-nesma-secondary/50 transition-all shadow-xl">
               <Maximize size={20} className="text-gray-300" />
           </button>
        </div>

        {/* Map */}
        <div id="map-container" ref={mapContainerRef} className="w-full h-full bg-[#051020]"></div>
        
        {/* Bottom Gradient Overlay for Aesthetics */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#051020] to-transparent pointer-events-none z-[400]"></div>
      </div>
    </div>
  );
};