import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  List, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  MessageSquare, 
  Columns, 
  Download, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  AtSign, 
  Link as LinkIcon, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Ban,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Platform = 'YouTube' | 'Instagram' | 'LinkedIn';

interface Lead {
  id: string;
  avatar: string;
  count: string;
  title: string;
  views: string;
  likes: string;
  category: string;
  dateGroup: 'This Week' | 'This Month';
}

const LEADS: Lead[] = [
  {
    id: '1',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWVynP9m5ENlGkVVpq1JTpsCR9qI-wt0t8TajbUINZAWcLR5XQ-QwBXfAifCcylb6Y4dBioE4xikesVjFRdJ9DAHtBfc6ZJKHOxIH3eroXJQyN01pa941KrJbj4pfT36C9BbaGbJ1sUN-xeAPwqfBvGEYy1ccvLELPuanTFcEaNWGHC4KEZS-HymZOqIwrwi31g_kd-BdcAJa-pS9_mN0CgAM1UEz4RaSAOvGODT4c1f0nP-ZGrKx_RJTgrJop1KAY2aYbH1_KCHOW',
    count: '102k',
    title: 'How to create n8n automation and start earning as an agency...',
    views: '12k',
    likes: '2k',
    category: 'Automation',
    dateGroup: 'This Week'
  },
  {
    id: '2',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvYXIFFI9MBio1jaWSymV68QTkbGQQQ6CuhDIPHRTmPwr2HET362N5TkoQdt5BaRWbH7XagRQriAfeGzfj9F_2KlUzVxeg9Shl4repak2dwvcso5TRgETCkWCw3cfuunompWEKpDLkbFvJ78tvdHf0W6sMJ93DfQhWUXlE0Zx9sCU-HslpLIf7_GVezJ1K4AjcaVtiRXvhGPhrkQd_V2lFZCTkUdKkUhDv2mnK9zHRVL6eqtsqx_DeTWoCVwOFLdaAFsQXps0aL5Mx',
    count: '102k',
    title: 'Start Earning with n8n automation agency services today...',
    views: '12k',
    likes: '2k',
    category: 'Business',
    dateGroup: 'This Week'
  },
  {
    id: '3',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmhurY8Z3uYiJ484Etot7a4iILcHYcb4eu-CkLV3cDGFEv8VlS8-o6dEcJkHZfzqZQ5vRLv00R_IjQpl8M-83vSupPB97cEQiqbSuBUSHqCs2RltgDXyoaEm0gYZ7Pcxjy3GEjaerQpWNZ4Hut2E7e2nP7tHkdpimivkntSIuVupsmSAs1_9GWgw4o82wcePVO9QWDSSfXSxhBF5rREqoCYAjNlklMNCff256lo38S-HtqFqLMtRI8frTvwfXqrl3IJzpmnMcdb_xx',
    count: '102k',
    title: 'Learn n8n and start earning $100k per year with these automations...',
    views: '12k',
    likes: '2k',
    category: 'Automation',
    dateGroup: 'This Month'
  }
];

const CATEGORIES = ['All', 'Education', 'Money', 'Business', 'Automation'];
const SUGGESTIONS = ['zapier', 'make.com', 'n8n', 'activepieces', 'paperclip', 'konnectify'];

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [search, setSearch] = useState('n8n');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const filteredLeads = LEADS.filter(lead => 
    activeCategory === 'All' || lead.category === activeCategory
  );

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-16 border-r border-outline-variant dark:border-[#27272a] bg-white dark:bg-[#09090b] z-50 flex flex-col items-center py-8 gap-10">
        <div className="p-2 text-primary-brand dark:text-white">
          <Menu className="w-6 h-6 stroke-[2.5px] cursor-pointer" />
        </div>
        <nav className="flex flex-col items-center gap-6 w-full">
          <SidebarItem icon={<Home className="w-5 h-5" />} active title="Home" />
          <SidebarItem icon={<Search className="w-5 h-5" />} title="Scrape" />
          <SidebarItem icon={<List className="w-5 h-5" />} title="Lists" />
          <SidebarItem icon={<BarChart3 className="w-5 h-5" />} title="Analytics" />
        </nav>
        <div className="mt-auto flex flex-col items-center gap-6 mb-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-xl text-outline hover:bg-surface-container dark:hover:bg-[#1a1a1a] transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <SidebarItem icon={<Settings className="w-5 h-5" />} title="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 bg-surface dark:bg-[#09090b] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-8 py-10">
          
          {/* Header */}
          <header className="relative mb-12">
            <div className="absolute right-0 top-0 flex items-center gap-4">
              <button className="text-sm font-medium text-outline hover:text-primary-brand dark:hover:text-white transition-colors">Log in</button>
              <button className="bg-primary-brand dark:bg-white text-white dark:text-[#09090b] px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all">Sign up</button>
            </div>
            
            <div className="text-center pt-2">
              <h1 className="text-4xl font-semibold tracking-tight mb-10 font-sans text-on-surface dark:text-white">Lead Scrape</h1>
              
              <div className="max-w-3xl mx-auto space-y-5">
                <div className="flex items-stretch shadow-sm border border-outline-variant dark:border-[#27272a] rounded-lg overflow-hidden bg-white dark:bg-[#09090b]">
                  <div className="relative border-r border-outline-variant dark:border-[#27272a]">
                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="appearance-none bg-transparent h-full px-5 py-3 pr-10 outline-none cursor-pointer text-sm font-medium text-on-surface dark:text-white"
                    >
                      <option>YouTube</option>
                      <option>Instagram</option>
                      <option>LinkedIn</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
                  </div>
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search keywords (e.g. n8n experts)" 
                    className="flex-grow px-5 py-3 outline-none text-sm bg-transparent text-on-surface dark:text-white"
                  />
                  <button className="bg-primary-brand dark:bg-white text-white dark:text-primary-brand px-7 flex items-center justify-center transition-all hover:opacity-80">
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSearch(s)}
                      className={`px-4 py-1.5 text-xs font-medium border border-outline-variant dark:border-[#27272a] rounded-full transition-all ${search === s ? 'bg-surface-container dark:bg-[#1a1a1a] border-outline' : 'hover:bg-surface-container/50 dark:hover:bg-[#1a1a1a] text-outline'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="h-px bg-outline-variant dark:bg-[#27272a] mb-8" />

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-sm font-medium rounded-md border transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary-brand dark:bg-white text-white dark:text-primary-brand border-primary-brand dark:border-white' : 'bg-white dark:bg-transparent border-outline-variant dark:border-[#27272a] text-outline dark:text-[#a1a1aa] hover:bg-surface-container/50 dark:hover:bg-[#1a1a1a]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ActionButton icon={<MessageSquare className="w-4 h-4" />} label="Proposal" />
              <ActionButton icon={<Columns className="w-4 h-4" />} label="Columns" />
              <ActionButton icon={<Download className="w-4 h-4" />} label="Export" suffix={<ChevronDown className="w-3 h-3" />} />
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <LeadSection title="This Week" leads={filteredLeads.filter(l => l.dateGroup === 'This Week')} />
            <LeadSection title="This Month" leads={filteredLeads.filter(l => l.dateGroup === 'This Month')} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, active = false, title }: { icon: React.ReactNode, active?: boolean, title: string }) {
  return (
    <a 
      href="#" 
      title={title}
      className={`p-3 rounded-xl transition-all duration-200 ${active ? 'bg-surface-container dark:bg-[#1a1a1a] text-primary-brand dark:text-white' : 'text-outline hover:bg-surface-container/50 dark:hover:bg-[#1a1a1a]'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 stroke-[2px]' })}
    </a>
  );
}

function ActionButton({ icon, label, suffix }: { icon: React.ReactNode, label: string, suffix?: React.ReactNode }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-outline-variant dark:border-[#27272a] rounded-md bg-white dark:bg-transparent text-outline dark:text-[#a1a1aa] hover:bg-surface-container/50 dark:hover:bg-[#1a1a1a] transition-all shadow-sm">
      <span className="text-[#a1a1aa]">{icon}</span>
      {label}
      {suffix && <span className="text-outline">{suffix}</span>}
    </button>
  );
}

function LeadSection({ title, leads }: { title: string, leads: Lead[] }) {
  if (leads.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-semibold text-outline uppercase tracking-[0.1em] mb-5">{title}</h3>
      <div className="space-y-3">
        {leads.map((lead, idx) => (
          <motion.div 
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex flex-col lg:flex-row items-stretch border border-outline-variant dark:border-[#27272a] rounded-lg overflow-hidden hover:border-outline dark:hover:border-[#3f3f46] transition-all bg-white dark:bg-[#09090b] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            {/* Avatar & Count */}
            <div className="p-4 flex items-center justify-center lg:w-24 border-b lg:border-b-0 lg:border-r border-outline-variant dark:border-[#27272a] bg-[#fafafa] dark:bg-[#0c0c0e]">
              <div className="flex flex-col items-center gap-1.5">
                <img src={lead.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant dark:border-[#27272a] grayscale group-hover:grayscale-0 transition-all duration-300" />
                <span className="text-[10px] font-mono font-medium text-outline">{lead.count}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow border-b lg:border-b-0 lg:border-r border-outline-variant dark:border-[#27272a] flex flex-col justify-center p-4 px-6">
              <h5 className="font-medium text-[15px] mb-3 text-on-surface dark:text-white line-clamp-1 group-hover:text-primary-brand dark:group-hover:text-white transition-colors">{lead.title}</h5>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-outline font-mono bg-surface-container dark:bg-[#1a1a1a] px-2.5 py-1 rounded">
                  <Eye className="w-3 h-3" /> {lead.views}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-outline font-mono bg-surface-container dark:bg-[#1a1a1a] px-2.5 py-1 rounded">
                  <ThumbsUp className="w-3 h-3" /> {lead.likes}
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center gap-4 border-b lg:border-b-0 lg:border-r border-outline-variant dark:border-[#27272a] p-4 px-6 bg-[#fdfdfd] dark:bg-[#0c0c0e]">
              <SocialIcon icon={<MessageCircle className="w-4 h-4" />} />
              <SocialIcon icon={<AtSign className="w-4 h-4" />} />
              <SocialIcon icon={<LinkIcon className="w-4 h-4" />} />
              <SocialIcon icon={<Globe className="w-4 h-4" />} />
              <SocialIcon icon={<Phone className="w-4 h-4" />} />
              <SocialIcon icon={<Mail className="w-4 h-4" />} />
              <SocialIcon icon={<MapPin className="w-4 h-4" />} />
            </div>

            {/* Actions */}
            <div className="flex items-stretch lg:w-72">
              <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#ecfdf5] dark:hover:bg-[#064e3b]/20 text-[#059669] font-medium text-sm transition-all border-r border-outline-variant dark:border-[#27272a]">
                <CheckCircle2 className="w-4 h-4" /> Qualify
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d]/20 text-outline hover:text-[#dc2626] font-medium text-sm transition-all">
                <Ban className="w-4 h-4" /> Ignore
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="text-outline-variant hover:text-primary-brand dark:hover:text-white transition-colors transform hover:scale-110">
      {icon}
    </a>
  );
}

