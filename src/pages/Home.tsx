import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Quote,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  GraduationCap,
  School,
  Award,
  BookMarked,
  Microscope,
  Palette,
  Music,
  Dna,
  User,
  UserCog,
  ShieldCheck,
  Atom,
  LayoutDashboard,
  Bell,
  MessageSquare,
  CreditCard,
  Lock,
  Wallet,
  ClipboardList,
  BarChart3,
  Search,
  Settings,
  LogOut,
  MoreHorizontal,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { settings } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const modules = [
    {
      title: 'STUDENT INFORMATION SYSTEM',
      description: 'Centralized database with personal academic records, attendance, and achievements.',
      icon: User,
      color: 'from-blue-600 to-blue-400',
      glow: 'shadow-blue-500/20'
    },
    {
      title: 'ACADEMIC MANAGEMENT',
      description: 'Course planning, timetable generation, grading, and result reports.',
      icon: GraduationCap,
      color: 'from-teal-600 to-teal-400',
      glow: 'shadow-teal-500/20'
    },
    {
      title: 'FEE & FINANCE',
      description: 'Online payment portal, detailed invoicing, and secure transaction tracking.',
      icon: Wallet,
      color: 'from-amber-500 to-yellow-400',
      glow: 'shadow-amber-500/20'
    },
    {
      title: 'COMMUNICATION HUB',
      description: 'Real-time messaging, announcements, notifications, and parent-teacher collaboration.',
      icon: MessageSquare,
      color: 'from-indigo-600 to-indigo-400',
      glow: 'shadow-indigo-500/20'
    },
    {
      title: 'PARENT PORTAL',
      description: 'Check grades, track progress, manage schedules, and communicate with teachers.',
      icon: Users,
      color: 'from-emerald-600 to-emerald-400',
      glow: 'shadow-emerald-500/20'
    },
    {
      title: 'STAFF PORTAL',
      description: 'Lesson planning, grade entry, leave management, and resource allocation.',
      icon: UserCog,
      color: 'from-slate-700 to-slate-500',
      glow: 'shadow-slate-500/20'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent',
      content: 'Game-changer for communication! I can track my child\'s progress in real-time.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Teacher',
      content: 'Saves me hours of administrative work! The grading system is so intuitive.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Staff',
      content: 'The resource allocation module has streamlined our entire department.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      rating: 5
    }
  ];

  const updates = [
    { title: 'Science Fair Winners Announced', time: '2 hours ago', type: 'Award' },
    { title: 'Parent-Teacher Meeting on 15th', time: '5 hours ago', type: 'Event' },
    { title: 'New Library Resources Added', time: '1 day ago', type: 'Update' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* 1. Grand Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 opacity-95" />
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block px-4 py-1.5 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[11px] font-black uppercase tracking-[0.3em] rounded-full mb-8">
                EDUCATIONAL EXCELLENCE
              </span>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-white mb-8 leading-[1.1] tracking-tight">
                EMPOWERING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-yellow-400">
                  FUTURE INNOVATORS
                </span>
              </h1>
              <p className="text-xl text-blue-100/80 mb-12 leading-relaxed max-w-xl font-medium">
                A complete, collaborative digital ecosystem for students, parents, and staff. Experience the future of education today.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link 
                  to="/academics" 
                  className="px-10 py-5 bg-teal-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-700 shadow-2xl shadow-teal-600/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center group"
                >
                  EXPLORE OUR PROGRAMS
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Visuals */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" 
                  alt="High-tech lab"
                  className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                {/* Holographic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent" />
                
                {/* 3D Hologram Mockups */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 right-1/4 w-48 h-48 bg-teal-500/30 backdrop-blur-xl border border-teal-400/50 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <Dna className="h-24 w-24 text-teal-300 animate-pulse" />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/4 left-1/4 w-56 h-40 bg-blue-500/30 backdrop-blur-xl border border-blue-400/50 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-6"
                >
                  <div className="w-full h-2 bg-blue-400/30 rounded-full mb-4 overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-400" />
                  </div>
                  <div className="w-full h-2 bg-blue-400/30 rounded-full mb-4 overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-400" />
                  </div>
                  <Atom className="h-12 w-12 text-blue-300" />
                </motion.div>

                {/* Floating Stats */}
                <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-teal-400 font-black text-2xl">98%</div>
                  <div className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Success Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Integrated Management Modules */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">CORE FEATURES</span>
            <h2 className="text-5xl font-serif font-black text-blue-900 dark:text-white mb-6">
              INTEGRATED MANAGEMENT MODULES
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {modules.map((module, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Glassmorphism Background Effect */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${module.color} opacity-[0.03] group-hover:opacity-10 rounded-full blur-3xl transition-opacity`} />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg ${module.glow} group-hover:scale-110 transition-transform`}>
                  <module.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-serif font-black text-blue-900 dark:text-white mb-4 tracking-tight">
                  {module.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                  {module.description}
                </p>
                
                <div className="flex items-center text-teal-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                  LEARN MORE <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trust & Community Section */}
      <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Institutional Partners */}
          <div className="mb-32">
            <h3 className="text-center text-[11px] font-black text-blue-900/40 dark:text-white/40 uppercase tracking-[0.4em] mb-16">
              PARTNERING FOR EDUCATIONAL EXCELLENCE
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <img 
                  key={i} 
                  src={`https://logo.clearbit.com/university.edu?size=100&i=${i}`} 
                  alt="Partner" 
                  className="h-12 w-auto filter dark:invert"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">
            {/* Testimonials */}
            <div className="lg:col-span-2">
              <span className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">COMMUNITY FEEDBACK</span>
              <h2 className="text-4xl font-serif font-black text-blue-900 dark:text-white mb-12">
                VERIFIED SUCCESS STORIES
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 relative group"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/20" />
                        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1 rounded-full shadow-lg">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-blue-900 dark:text-white">{t.name}</h4>
                        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed mb-6">
                      "{t.content}"
                    </p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Feed Widget */}
            <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full" />
              <h3 className="text-xl font-serif font-black mb-10 flex items-center">
                <Activity className="mr-3 h-6 w-6 text-teal-400" />
                ACTIVITY FEED
              </h3>
              <div className="space-y-8">
                {updates.map((update, idx) => (
                  <div key={idx} className="flex items-start space-x-4 group cursor-pointer">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-teal-400 group-hover:scale-150 transition-transform" />
                    <div>
                      <h4 className="text-sm font-bold mb-1 group-hover:text-teal-400 transition-colors">{update.title}</h4>
                      <div className="flex items-center text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        <Clock className="mr-1.5 h-3 w-3" />
                        {update.time} • {update.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                VIEW ALL UPDATES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Personalized Gateway (Login Section) */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-teal-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">SECURE ACCESS</span>
            <h2 className="text-5xl font-serif font-black text-blue-900 dark:text-white mb-6">
              YOUR PERSONALIZED GATEWAY
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
            {/* Side Logins (Left) */}
            <div className="xl:col-span-3 flex flex-col gap-8">
              <LoginCard title="PARENT LOGIN" icon={Users} to="/parent/login" />
              <LoginCard title="STUDENT LOGIN" icon={User} to="/student/login" />
            </div>

            {/* Main Admin Portal Card */}
            <div className="xl:col-span-6">
              <div className="h-full bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col group">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-900 p-4 rounded-2xl shadow-lg">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-black text-blue-900 dark:text-white">ADMIN PORTAL</h3>
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Central Management System</p>
                    </div>
                  </div>
                  <Link to="/admin/login" className="px-8 py-4 bg-blue-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20">
                    LOGIN NOW
                  </Link>
                </div>
                
                {/* Dashboard Preview Mockup */}
                <div className="flex-grow bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MINI-DASHBOARD PREVIEW</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-between">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                      <div key={i} className="flex-1 bg-teal-500/20 rounded-t-lg group-hover:bg-teal-500 transition-all duration-500" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Logins (Right) */}
            <div className="xl:col-span-3 flex flex-col gap-8">
              <LoginCard title="STAFF LOGIN" icon={UserCog} to="/teacher/login" />
              <LoginCard title="GUEST ACCESS" icon={Users} to="/guest/access" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoginCard({ title, icon: Icon, to }: { title: string, icon: any, to: string }) {
  return (
    <Link to={to} className="group h-full">
      <div className="h-full bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-teal-500/50 transition-all flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-serif font-black text-blue-900 dark:text-white mb-6 tracking-widest uppercase">{title}</h4>
        <div className="mt-auto px-6 py-3 bg-teal-600/10 text-teal-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all">
          LOGIN NOW
        </div>
      </div>
    </Link>
  );
}


