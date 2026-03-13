import { useState } from 'react';
import {
  Truck, Network, ShoppingCart, Package, Shield, Leaf,
  FileText, BarChart3, Bot, Heart, Clock, ChevronDown,
  ChevronRight, LayoutGrid
} from 'lucide-react';
import { PROMPTS } from '../../data/prompts';
import type { Category, FilterState } from '../../types';

const CATEGORIES: { name: Category; icon: React.ReactNode; subcategories: string[] }[] = [
  {
    name: 'Transportation Management',
    icon: <Truck className="w-4 h-4" />,
    subcategories: ['Route Optimization', 'Fleet Management', 'Carrier Selection', 'Transportation Cost Analysis', 'Last-Mile Delivery', 'Temperature Monitoring', 'Cold Chain Compliance', 'Perishable Goods Handling', 'Refrigeration Technologies', 'Cold Chain Risk Management', 'Freight Consolidation', 'Shipping Cost Optimization', 'Multimodal Transportation', 'Freight Forwarding', 'Order Fulfillment', 'Delivery Tracking and Notifications', 'Customer Returns Handling', 'Service Level Agreements', 'Customer Feedback Integration', 'Order Management', 'Fulfillment Strategies', 'Customer Experience Management', 'Service Level Agreements Advanced'],
  },
  {
    name: 'Logistics Network Design',
    icon: <Network className="w-4 h-4" />,
    subcategories: ['Distribution Network Optimization', 'Facility Location Planning', 'Transportation Network Design', 'Logistics Infrastructure Development', 'Cross-Docking Strategies', 'Returns Management', 'Recycling and Disposal', 'Warranty and Repairs', 'Refurbishment Processes', 'Circular Economy Strategies', 'End-to-End Supply Chain Visibility', 'Integrated Business Planning', 'Collaborative Planning and Forecasting', 'Information Sharing and Transparency', 'Returns and Reverse Logistics', 'New Product Introduction', 'End-of-Life Management', 'Design for Supply Chain', 'Global Logistics and Distribution', 'Cross-Border Supply Chain Management', 'Global Supply Chain Strategy', 'Industry Consortiums', 'Collaborative Logistics', 'Strategic Alliances', 'Supply Chain Network Design'],
  },
  {
    name: 'Procurement & Sourcing',
    icon: <ShoppingCart className="w-4 h-4" />,
    subcategories: ['Vendor Managed Inventory', 'Collaborative Planning and Replenishment', 'Partner Relationship Management', 'Joint Ventures in Logistics', 'Collaborative Transportation Management', 'Strategic Sourcing', 'Supplier Selection and Evaluation', 'Supplier Relationship Management', 'Procurement Cost Optimization', 'Contract Management', 'Ethical and Sustainable Sourcing', 'Supplier Development Programs', 'Supplier Performance Monitoring', 'Strategic Alliances and Partnerships', 'Vendor Managed Inventory Advanced', 'Supplier Collaboration Platforms', 'Joint Ventures in Supply Chain', 'Public-Private Partnerships'],
  },
  {
    name: 'Inventory Management',
    icon: <Package className="w-4 h-4" />,
    subcategories: ['Inventory Optimization', 'Warehouse Layout Design', 'Automated Storage and Retrieval Systems', 'Order Picking Strategies', 'Warehouse Safety and Compliance', 'Stock Replenishment Strategies', 'Safety Stock Calculation', 'Inventory Turnover Analysis', 'ABC Analysis', 'Inventory Tracking Systems'],
  },
  {
    name: 'Risk Management',
    icon: <Shield className="w-4 h-4" />,
    subcategories: ['Supply Chain Disruption Planning', 'Risk Assessment and Mitigation', 'Contingency Planning', 'Crisis Management', 'Insurance and Liability Management', 'Supply Chain Risk Assessment', 'Contingency Planning Advanced', 'Disruption Management', 'Business Continuity Planning', 'Supply Chain Security', 'Risk Management and Mitigation Advanced', 'Cultural and Geopolitical Considerations'],
  },
  {
    name: 'Sustainability & ESG',
    icon: <Leaf className="w-4 h-4" />,
    subcategories: ['Green Logistics Practices', 'Carbon Footprint Reduction', 'Sustainable Packaging', 'Energy-Efficient Transportation', 'Waste Management', 'Carbon Footprint Reduction Advanced', 'Sustainable Packaging Advanced', 'Ethical Sourcing and Fair Trade', 'Circular Supply Chains', 'Environmental Impact Analysis', 'Sustainability and Green Supply Chain'],
  },
  {
    name: 'Documentation & Compliance',
    icon: <FileText className="w-4 h-4" />,
    subcategories: ['Customs and Trade Compliance', 'International Trade Compliance', 'Tariffs and Trade Policies', 'Regulatory Compliance', 'Anti-Corruption Measures', 'Ethical Business Practices', 'Labor Standards and Human Rights', 'Compliance Audits'],
  },
  {
    name: 'Analytics & Reporting',
    icon: <BarChart3 className="w-4 h-4" />,
    subcategories: ['Predictive Analytics', 'Seasonal Demand Patterns', 'Market Trend Analysis', 'Sales Forecasting', 'Demand Sensing', 'Logistics Performance Measurement', 'KPI Dashboards', 'Benchmarking and Analysis', 'Continuous Improvement', 'Cost-to-Serve Analysis', 'Predictive Analytics Advanced', 'Market Trend Analysis Advanced', 'Seasonal Demand Patterns Advanced', 'Collaborative Forecasting', 'Demand Sensing Advanced', 'Big Data Analytics', 'Real-Time Monitoring and Dashboards', 'KPI and Performance Measurement', 'Predictive and Prescriptive Analytics', 'Data-Driven Decision Making', 'Real-Time Tracking', 'End-to-End Supply Chain Monitoring', 'Supply Chain Transparency', 'Product Data Management', 'Product Quality Management', 'Total Cost of Ownership', 'Cost-to-Serve Analysis Advanced', 'Cost Reduction Strategies', 'Budgeting and Financial Planning', 'Activity-Based Costing', 'Supply Chain Performance Measurement', 'Balanced Scorecard Approach', 'Benchmarking and Best Practices', 'Efficiency and Effectiveness Metrics', 'Continuous Improvement Programs'],
  },
  {
    name: 'AI & Automation',
    icon: <Bot className="w-4 h-4" />,
    subcategories: ['RFID and IoT Integration', 'Data Analytics for Visibility', 'Automation and Robotics', 'Blockchain for Logistics', 'AI and Machine Learning Applications', 'Cloud-Based Logistics Solutions', 'Digital Twins in Logistics', 'EDI and API Integration', 'Lean Manufacturing Principles', 'Agile Supply Chain Strategies', 'Continuous Improvement Kaizen', 'Waste Reduction Techniques', 'Flexibility and Responsiveness', 'Emerging Technologies in SCM', 'Future Supply Chain Trends', 'Innovation Management', 'Digital Transformation', 'Industry 4.0'],
  },
];

// Precompute counts
const totalCount = PROMPTS.length;
const catCounts: Record<string, number> = {};
const subCounts: Record<string, number> = {};
for (const p of PROMPTS) {
  catCounts[p.category] = (catCounts[p.category] ?? 0) + 1;
  subCounts[p.subcategory] = (subCounts[p.subcategory] ?? 0) + 1;
}

interface SidebarProps {
  filterState: FilterState;
  setFilterState: (s: FilterState | ((prev: FilterState) => FilterState)) => void;
  viewMode: 'all' | 'favorites' | 'recent';
  setViewMode: (v: 'all' | 'favorites' | 'recent') => void;
  favoritesCount: number;
  recentCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  filterState,
  setFilterState,
  viewMode,
  setViewMode,
  favoritesCount,
  recentCount,
  isOpen,
  onClose,
}: SidebarProps) {
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const toggleCat = (name: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const selectCategory = (cat: Category | 'All') => {
    setFilterState((s) => ({ ...s, category: cat }));
    setViewMode('all');
    if (window.innerWidth < 1024) onClose();
  };

  const selectSubcategory = (sub: string) => {
    setFilterState((s) => ({ ...s, category: 'All' }));
    // Filter by subcategory via search
    setFilterState((s) => ({ ...s, searchQuery: sub }));
    setViewMode('all');
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed left-0 top-16 bottom-0 z-30 w-64 bg-white dark:bg-gray-900
          border-r border-slate-200 dark:border-gray-700
          overflow-y-auto transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="py-3" aria-label="Prompt categories">
          {/* All prompts */}
          <button
            onClick={() => { selectCategory('All'); setViewMode('all'); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              viewMode === 'all' && filterState.category === 'All'
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-semibold border-l-2 border-brand-600'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            <span>All Prompts</span>
            <span className="ml-auto text-xs font-medium text-slate-400">{totalCount.toLocaleString()}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => setViewMode('favorites')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              viewMode === 'favorites'
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-semibold border-l-2 border-brand-600'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>Favorites</span>
            <span className="ml-auto text-xs font-medium text-slate-400">{favoritesCount}</span>
          </button>

          {/* Recent */}
          <button
            onClick={() => setViewMode('recent')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              viewMode === 'recent'
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-semibold border-l-2 border-brand-600'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800'
            }`}
          >
            <Clock className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span>Recently Viewed</span>
            <span className="ml-auto text-xs font-medium text-slate-400">{recentCount}</span>
          </button>

          <div className="border-t border-slate-100 dark:border-gray-700 my-2" />

          {/* Category list */}
          {CATEGORIES.map((cat) => {
            const isActive = filterState.category === cat.name && viewMode === 'all';
            const isExpanded = expandedCats.has(cat.name);
            const count = catCounts[cat.name] ?? 0;

            return (
              <div key={cat.name}>
                <div className={`flex items-center ${isActive ? 'border-l-2 border-brand-600 bg-brand-50 dark:bg-brand-900/20' : ''}`}>
                  <button
                    onClick={() => selectCategory(cat.name)}
                    className={`flex-1 flex items-center gap-2.5 pl-4 pr-2 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'text-brand-700 dark:text-brand-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className={isActive ? 'text-brand-600' : 'text-slate-400 dark:text-gray-500'}>
                      {cat.icon}
                    </span>
                    <span className="truncate text-left">{cat.name}</span>
                    <span className="ml-auto text-xs font-medium text-slate-400 flex-shrink-0">{count}</span>
                  </button>
                  <button
                    onClick={() => toggleCat(cat.name)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${cat.name}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Subcategories */}
                <div
                  style={{
                    maxHeight: isExpanded ? '1000px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease',
                  }}
                >
                  {cat.subcategories.map((sub) => {
                    const subCount = subCounts[sub] ?? 0;
                    if (subCount === 0) return null;
                    return (
                      <button
                        key={sub}
                        onClick={() => selectSubcategory(sub)}
                        className="w-full flex items-center gap-2 pl-10 pr-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <span className="truncate">{sub}</span>
                        <span className="ml-auto text-slate-300 dark:text-gray-600">{subCount}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
