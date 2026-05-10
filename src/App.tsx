import * as React from 'react';
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
  // Menu,
  BadgeCheck,
  Clock,
  Share2,
  Terminal,
  Database,
  Users,
  Copy,
  Check,
  Loader2,
  SendHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

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
  subscribers?: string;
  channelName?: string;
  timeAgo?: string;
}

const LEADS: Lead[] = [
  {
    id: '1',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWVynP9m5ENlGkVVpq1JTpsCR9qI-wt0t8TajbUINZAWcLR5XQ-QwBXfAifCcylb6Y4dBioE4xikesVjFRdJ9DAHtBfc6ZJKHOxIH3eroXJQyN01pa941KrJbj4pfT36C9BbaGbJ1sUN-xeAPwqfBvGEYy1ccvLELPuanTFcEaNWGHC4KEZS-HymZOqIwrwi31g_kd-BdcAJa-pS9_mN0CgAM1UEz4RaSAOvGODT4c1f0nP-ZGrKx_RJTgrJop1KAY2aYbH1_KCHOW',
    count: '102k',
    title: 'How to create n8n automation and start earning as an agency owner in 2024',
    views: '12k',
    likes: '2k',
    category: 'Automation',
    dateGroup: 'This Week',
    subscribers: '1.2M Subscribers',
    channelName: 'n8n Masterclass',
    timeAgo: '2d ago'
  },
  {
    id: '2',
    avatar: '/img/girl.png',
    count: '102k',
    title: 'Start Earning with n8n automation agency services today with these simple steps',
    views: '12k',
    likes: '2k',
    category: 'Business',
    dateGroup: 'This Week',
    subscribers: '850K Subscribers',
    channelName: 'Automation Guru',
    timeAgo: '1d ago'
  },
  {
    id: '3',
    avatar: '/img/alien.png',
    count: '102k',
    title: 'Learn n8n and start earning $100k per year with these advanced automation strategies',
    views: '12k',
    likes: '2k',
    category: 'Automation',
    dateGroup: 'This Month',
    subscribers: '45k Subscribers',
    channelName: 'Lead Gen Pro',
    timeAgo: '1w ago'
  }
];

const CATEGORIES = ['All', 'Education', 'Money', 'Business', 'Automation'];
const SUGGESTIONS = ['zapier', 'make.com', 'n8n', 'activepieces', 'paperclip', 'konnectify'];

let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [platform, setPlatform] = React.useState<Platform>('YouTube');
  const [inputValue, setInputValue] = React.useState('n8n');
  const [search, setSearch] = React.useState('n8n');
  const [dynamicSuggestions, setDynamicSuggestions] = React.useState<string[]>(['zapier', 'make.com', 'n8n', 'activepieces', 'paperclip', 'konnectify']);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = React.useState(false);
  
  // Debounce input value to search state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);
  
  // Proposal Modal State
  const [isProposalOpen, setIsProposalOpen] = React.useState(false);

  const fetchTrendingKeywords = async (query: string) => {
    setIsFetchingSuggestions(true);
    try {
      const ai = getGenAI();
      const prompt = query.trim() 
        ? `Given the search term "${query}", suggest 6 related trending software tools, automation platforms, or technical keywords specifically in the B2B/SaaS space. Return ONLY a comma-separated list of names.`
        : `Suggest 6 of the most currently trending software tools, AI platforms, or automation frameworks (e.g. Cursor, Replit, n8n, LangChain). Return ONLY a comma-separated list of names.`;

      const result = await ai.models.generateContent({
        model: "models/gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      const text = result.text;
      const keywords = (text || '').split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 6);
      if (keywords.length > 0) setDynamicSuggestions(keywords);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  React.useEffect(() => {
    fetchTrendingKeywords(search);
  }, [search]);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [proposalText, setProposalText] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [refineInput, setRefineInput] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const generateProposal = async (lead: Lead, refinement?: string) => {
    setIsGenerating(true);
    if (!proposalText) setIsProposalOpen(true);
    setSelectedLead(lead);

    try {
      const ai = getGenAI();
      const prompt = refinement 
        ? `Given this existing proposal: "${proposalText}", refine it with this instruction: "${refinement}". 
           Keep the context of the lead: Title: ${lead.title}, Channel: ${lead.channelName}, Subscribers: ${lead.subscribers}.`
        : `Generate a professional and engaging outreach proposal for a potential lead. 
           Lead Details:
           - Video Title: ${lead.title}
           - Channel Name: ${lead.channelName}
           - Subscribers: ${lead.subscribers}
           - Topic: ${lead.category}
           
           The proposal should be concise, mention a specific detail from their title, and offer automation services to help scale their business. 
           Use a friendly but professional tone. Do not include subject lines, just the body.`;

      const result = await ai.models.generateContent({
        model: "models/gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      setProposalText(result.text || "No text generated.");
    } catch (error) {
      console.error("Failed to generate proposal:", error);
      setProposalText("Error generating proposal. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (filteredLeads.length === 0) return;
    
    const headers = ['ID', 'Channel Name', 'Subscribers', 'Title', 'Views', 'Likes', 'Category', 'Post Date'];
    const csvRows = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.id}"`,
        `"${(lead.channelName || '').replace(/"/g, '""')}"`,
        `"${(lead.subscribers || lead.count).replace(/"/g, '""')}"`,
        `"${lead.title.replace(/"/g, '""')}"`,
        `"${lead.views}"`,
        `"${lead.likes}"`,
        `"${lead.category}"`,
        `"${lead.dateGroup}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
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
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen font-sans w-full bg-background transition-colors duration-200">
          {/* Sidebar */}
          <AppSidebar isDark={isDark} setIsDark={setIsDark} />

          {/* Main Content */}
          <SidebarInset>
            <div className="flex flex-col h-full">
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 lg:px-8">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm font-medium">Dashboard</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Log in</button>
                  <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all">Sign up</button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
                  {/* Hero Header */}
                  <div className="text-center pt-2 mb-12">
                    <h1 className="text-4xl font-semibold tracking-tight mb-10 font-sans text-foreground">Lead Scrape</h1>
                    
                    <div className="max-w-3xl mx-auto space-y-5">
                      <div className="flex items-stretch shadow-sm border border-border rounded-xl overflow-hidden bg-background ring-1 ring-border/50">
                        <div className="relative border-r border-border flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button className="flex h-full items-center gap-2 px-5 py-3 outline-none cursor-pointer text-sm font-medium text-foreground hover:bg-accent transition-colors">
                                  {platform}
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                              }
                            />
                            <DropdownMenuContent align="start" className="bg-popover border border-border min-w-[140px]">
                              <DropdownMenuItem onSelect={() => setPlatform('YouTube')} className="cursor-pointer focus:bg-accent transition-colors">
                                YouTube
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setPlatform('Instagram')} className="cursor-pointer focus:bg-accent transition-colors">
                                Instagram
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setPlatform('LinkedIn')} className="cursor-pointer focus:bg-accent transition-colors">
                                LinkedIn
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Search keywords (e.g. n8n experts)" 
                          className="grow px-5 py-3 outline-none text-sm bg-transparent text-foreground"
                        />
                        <button className="bg-primary text-primary-foreground px-7 flex items-center justify-center transition-all hover:opacity-80">
                          <Search className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 min-h-[32px]">
                        <AnimatePresence mode="popLayout">
                          {dynamicSuggestions.map((s, idx) => (
                            <motion.button 
                              key={s}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => {
                                setInputValue(s);
                                setSearch(s);
                              }}
                              className={`px-4 py-1.5 text-xs font-medium border border-border rounded-full transition-all ${search === s ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'hover:bg-muted text-muted-foreground bg-background'}`}
                            >
                              {s}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                        {isFetchingSuggestions && (
                          <div className="flex items-center ml-2">
                            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="mb-8" />

                  {/* Controls */}
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-end">
                      <div className="flex items-center gap-2">
                        <ActionButton 
                          icon={<MessageSquare className="w-4 h-4" />} 
                          label="Proposal" 
                          onClick={() => {
                            const lead = filteredLeads[0];
                            if (lead) generateProposal(lead);
                          }}
                        />
                        <ActionButton icon={<Columns className="w-4 h-4" />} label="Columns" />
                        <ActionButton icon={<Download className="w-4 h-4" />} label="Export" onClick={handleExport} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:bg-accent'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-12">
                    <LeadSection 
                      title="This Week" 
                      leads={filteredLeads.filter(l => l.dateGroup === 'This Week')} 
                      onProposal={(l) => generateProposal(l)}
                    />
                    <LeadSection 
                      title="This Month" 
                      leads={filteredLeads.filter(l => l.dateGroup === 'This Month')} 
                      onProposal={(l) => generateProposal(l)}
                    />
                  </div>
                </div>
              </main>

              {/* Proposal Dialog */}
              <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
                <DialogContent className="max-w-2xl bg-background border-border p-0 overflow-hidden rounded-2xl shadow-2xl">
                  <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-xl font-semibold">AI Proposal Generator</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                          Crafting a custom message for <span className="font-medium text-foreground">{selectedLead?.channelName}</span>
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="px-6 py-4">
                    <div className="relative group">
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button 
                          onClick={handleCopy}
                          className="p-2 bg-background/80 backdrop-blur border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
                          title="Copy to clipboard"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className={`min-h-[240px] p-6 rounded-xl border border-border bg-muted/30 font-sans leading-relaxed text-foreground whitespace-pre-wrap overflow-y-auto max-h-[400px] ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? (
                          <div className="flex flex-col gap-3">
                            <div className="h-4 bg-muted-foreground/10 rounded w-3/4" />
                            <div className="h-4 bg-muted-foreground/10 rounded w-full" />
                            <div className="h-4 bg-muted-foreground/10 rounded w-5/6" />
                            <div className="h-4 bg-muted-foreground/10 rounded w-2/3" />
                          </div>
                        ) : (
                          proposalText || "No proposal generated yet."
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-2 bg-muted/10 border-t border-border">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (selectedLead && refineInput.trim()) {
                          generateProposal(selectedLead, refineInput);
                          setRefineInput('');
                        }
                      }}
                      className="flex items-center gap-3 bg-background border border-border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm"
                    >
                      <input 
                        type="text"
                        value={refineInput}
                        onChange={(e) => setRefineInput(e.target.value)}
                        placeholder="Refine the proposal... (e.g. 'Make it more casual')"
                        className="flex-1 bg-transparent border-none outline-none px-3 text-sm"
                        disabled={isGenerating}
                      />
                      <button 
                        type="submit"
                        disabled={isGenerating || !refineInput.trim()}
                        className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 px-4 h-9"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span className="text-xs font-semibold">Refine</span>
                            <SendHorizontal className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function AppSidebar({ isDark, setIsDark }: { isDark: boolean, setIsDark: (v: boolean) => void }) {
  const navItems = [
    { title: "Home", icon: Home, active: true },
    { title: "Scrape", icon: Search },
    { title: "Lists", icon: List },
    { title: "Analytics", icon: BarChart3 },
    { title: "Settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Terminal className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Lead Scrape</span>
                <span className="truncate text-xs">v1.2.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.title}
                    render={
                      <a href="#">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="YouTube"
                  render={
                    <a href="#">
                      <Database className="size-4" />
                      <span>YouTube API</span>
                    </a>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="LinkedIn"
                  render={
                    <a href="#">
                      <Users className="size-4" />
                      <span>LinkedIn Scraper</span>
                    </a>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsDark(!isDark)} tooltip="Toggle Theme">
              {isDark ? <Sun /> : <Moon />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-4 flex items-center gap-2">
          <div className="size-8 rounded-full bg-muted border flex items-center justify-center">
            <span className="text-[10px] font-bold">NR</span>
          </div>
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-medium truncate">Nafees Rayyan</p>
            <p className="text-[10px] text-muted-foreground truncate">nafees.rayyan@gmail.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function ActionButton({ icon, label, suffix, onClick }: { icon: React.ReactNode, label: string, suffix?: React.ReactNode, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md bg-background text-muted-foreground hover:bg-accent transition-all shadow-sm"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
      {suffix && <span className="text-muted-foreground">{suffix}</span>}
    </button>
  );
}

function LeadSection({ title, leads, onProposal }: { title: string, leads: Lead[], onProposal: (l: Lead) => void }) {
  if (leads.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-5">{title}</h3>
      <div className="space-y-3">
        {leads.map((lead, idx) => (
          <motion.div 
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group block lg:flex items-stretch border border-border rounded-xl overflow-hidden hover:border-muted-foreground/50 transition-all bg-background shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            {/* Mobile View Layout (Matches Phone UI reference) */}
            <div className="lg:hidden p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center border border-border overflow-hidden">
                    <img src={lead.avatar} alt="Avatar" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{lead.channelName || 'Channel Name'}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{lead.subscribers || lead.count + ' Subscribers'}</p>
                  </div>
                </div>
                <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-3">
                <h5 className="font-semibold text-sm text-foreground leading-snug truncate">
                  {lead.title}
                </h5>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {lead.views} Views
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> {lead.likes} Likes
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lead.timeAgo || '2d ago'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 px-1">
                <SocialIcon icon={<Mail className="w-5 h-5" />} />
                <SocialIcon icon={<Globe className="w-5 h-5" />} />
                <SocialIcon icon={<AtSign className="w-5 h-5" />} />
                <SocialIcon icon={<Share2 className="w-5 h-5" />} />
              </div>

              <div className="flex gap-3 mt-1">
                <button 
                  onClick={() => onProposal(lead)}
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-md font-semibold text-sm shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Proposal
                </button>
                <button className="flex-1 bg-background border border-border text-foreground py-2.5 rounded-md font-semibold text-sm hover:bg-muted transition-all">
                  Qualify
                </button>
              </div>
            </div>

            {/* Desktop View Layout (Original) */}
            <div className="hidden lg:flex w-full items-stretch">
              {/* Avatar & Count */}
              <div className="p-4 flex items-center justify-center lg:w-24 border-r border-border bg-muted/30">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative group/avatar">
                    <img src={lead.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-border grayscale group-hover/avatar:grayscale-0 transition-all duration-300" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-muted-foreground">{lead.count}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow border-r border-border flex flex-col justify-center p-4 px-6">
                <h5 className="font-medium text-[15px] mb-3 text-foreground truncate max-w-[50ch] group-hover:text-primary transition-colors">
                  {lead.title}
                </h5>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded">
                    <Eye className="w-3 h-3" /> {lead.views}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded">
                    <ThumbsUp className="w-3 h-3" /> {lead.likes}
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center justify-center gap-4 border-r border-border p-4 px-6 bg-muted/10">
                <SocialIcon icon={<MessageCircle className="w-4 h-4" />} />
                <SocialIcon icon={<AtSign className="w-4 h-4" />} />
                <SocialIcon icon={<LinkIcon className="w-4 h-4" />} />
                <SocialIcon icon={<Globe className="w-4 h-4" />} />
                <SocialIcon icon={<Phone className="w-4 h-4" />} />
                <SocialIcon icon={<Mail className="w-4 h-4" />} />
                <SocialIcon icon={<MapPin className="w-4 h-4" />} />
              </div>

              {/* Actions */}
              <div className="flex items-stretch lg:w-[320px]">
                <button 
                  onClick={() => onProposal(lead)}
                  className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/10 text-primary font-medium text-sm transition-all border-r border-border"
                >
                  <MessageSquare className="w-4 h-4" /> Proposal
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 font-medium text-sm transition-all border-r border-border">
                  <CheckCircle2 className="w-4 h-4" /> Qualify
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive font-medium text-sm transition-all">
                  <Ban className="w-4 h-4" /> Ignore
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="text-muted-foreground/60 hover:text-primary transition-colors transform hover:scale-110">
      {icon}
    </a>
  );
}


