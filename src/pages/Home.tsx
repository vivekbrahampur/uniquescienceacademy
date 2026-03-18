import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Quote, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Award,
  ShieldCheck,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { settings: themeSettings } = useTheme();
  const [settings, setSettings] = useState({ 
    logo_url: 'https://picsum.photos/seed/schoollogo/200/200', 
    gallery_images: [
      'https://picsum.photos/seed/school1/1920/1080',
      'https://picsum.photos/seed/school2/1920/1080',
      'https://picsum.photos/seed/school3/1920/1080'
    ], 
    testimonials: [
      { id: 1, name: 'Rahul Kumar', role: 'Student', text: 'The environment here is amazing. Teachers are very supportive.', image: 'https://picsum.photos/seed/student1/100/100' },
      { id: 2, name: 'Suman Devi', role: 'Parent', text: 'I have seen a great improvement in my child\'s confidence and academic performance.', image: 'https://picsum.photos/seed/parent1/100/100' },
      { id: 3, name: 'Amit Singh', role: 'Alumni', text: 'Unique Science Academy laid the foundation for my career in engineering.', image: 'https://picsum.photos/seed/alumni1/100/100' }
    ],
    school_name: themeSettings?.schoolName || 'Unique Science Academy',
    hero_title: 'Excellence in Education',
    hero_subtitle: 'Nurturing the leaders of tomorrow with a focus on science, innovation, and character building.',
    news_ticker: '🚀 Admissions open for Session 2026-2027 | 🏆 Annual Science Exhibition on 25th March | 📚 New Library Wing Inaugurated',
    about_title: 'Our Legacy of Learning',
    about_text: 'At Unique Science Academy, we believe that education is not just about textbooks, but about igniting a passion for discovery. Our state-of-the-art facilities and dedicated faculty ensure that every student reaches their full potential.',
    about_image: 'https://picsum.photos/seed/academy/800/600',
    principal_name: 'Dr. A. K. Sharma',
    principal_message: 'Our mission is to provide a holistic education that balances academic rigor with creative exploration. We empower our students to be critical thinkers and compassionate citizens of the world.',
    principal_image: 'https://picsum.photos/seed/principal/400/400',
    contact_address: 'Brahampur, Jale, Darbhanga, Bihar 847307',
    contact_phone: '+91 98765 43210',
    contact_email: 'info@uniquescienceacademy.in',
    result_section_enabled: true,
    home_page_qr_content: ''
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const fetchResults = () => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchResults();
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings(prev => ({
            ...prev,
            ...data,
            gallery_images: Array.isArray(data.gallery_images) && data.gallery_images.length > 0 ? data.gallery_images : prev.gallery_images,
            testimonials: Array.isArray(data.testimonials) && data.testimonials.length > 0 ? data.testimonials : prev.testimonials
          }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (settings.gallery_images.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % settings.gallery_images.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [settings.gallery_images]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Dynamic News Ticker */}
      <AnimatePresence>
        {settings.news_ticker && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-950 text-white py-3 px-4 flex items-center overflow-hidden border-b border-white/5 relative z-[110]"
          >
            <div className="bg-amber-500 text-slate-950 font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest mr-6 z-10 shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
              Latest News
            </div>
            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="inline-block font-bold text-xs uppercase tracking-widest opacity-80"
              >
                {settings.news_ticker}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          {settings.gallery_images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1.05 : 1.15
              }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 z-10" />
              <img src={img} alt="Hero" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-10"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-amber-500 flex items-center justify-center text-[8px] font-bold text-slate-900">
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Excellence Since 2005</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-8 leading-[0.9] tracking-tight">
              {settings.hero_title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-amber-500' : ''}>{word} </span>
              ))}
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-16 font-medium leading-relaxed opacity-80">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/student/login" className="group relative px-10 py-5 bg-amber-500 text-slate-950 font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.3)]">
                <span className="relative z-10 uppercase tracking-widest text-sm">Student Portal</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <a href="#about" className="group px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm flex items-center space-x-3">
                <span>Explore Academy</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-20" />
      </section>

      {/* Stats Section */}
      <section className="relative z-30 -mt-24 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Students', value: '1500+', icon: Users, color: 'amber' },
            { label: 'Teachers', value: '50+', icon: GraduationCap, color: 'blue' },
            { label: 'Labs', value: '12', icon: Zap, color: 'emerald' },
            { label: 'Awards', value: '100+', icon: Award, color: 'rose' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 text-center hover:scale-105 transition-all duration-500"
            >
              <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform`}>
                <stat.icon className={`h-8 w-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
              
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[12px] border-slate-50 dark:border-slate-900">
                <img src={settings.about_image} alt="Academy" className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-1000" />
                
                <div className="absolute top-8 right-8 bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-full text-[10px] uppercase tracking-widest shadow-xl">
                  Est. 2005
                </div>

                <div className="absolute bottom-10 left-10 right-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="flex items-center space-x-6">
                    <div className="bg-amber-500 p-4 rounded-2xl shadow-lg shadow-amber-500/30">
                      <ShieldCheck className="h-8 w-8 text-slate-950" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xl text-slate-900 dark:text-white">ISO 9001:2015</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Certified Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span>Our Legacy</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-10 leading-[1.1] tracking-tight">
                {settings.about_title}
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium opacity-80">
                {settings.about_text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Modern Labs', desc: 'Advanced scientific research facilities.', icon: Zap, color: 'amber' },
                  { title: 'Expert Faculty', desc: 'Mentors with decades of experience.', icon: GraduationCap, color: 'blue' },
                  { title: 'Digital Learning', desc: 'Smart classrooms for modern education.', icon: BookOpen, color: 'emerald' },
                  { title: 'Holistic Growth', icon: Star, desc: 'Focus on character and skills.', color: 'rose' }
                ].map((item, i) => (
                  <div key={i} className="group flex items-start space-x-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className={`mt-1 bg-${item.color}-100 dark:bg-${item.color}-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principal's Message - Editorial Style */}
      <section className="py-40 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Quote className="h-20 w-20 text-amber-500/10 mx-auto mb-12" />
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-16 leading-[1.2] italic tracking-tight">
              "{settings.principal_message}"
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute -inset-2 bg-amber-500 rounded-full blur opacity-20" />
                <img src={settings.principal_image} alt="Principal" className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-2xl" />
              </div>
              <h4 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">{settings.principal_name}</h4>
              <div className="flex items-center space-x-3">
                <div className="h-px w-8 bg-amber-500" />
                <p className="text-amber-600 dark:text-amber-400 font-black uppercase tracking-[0.3em] text-[10px]">Principal Message</p>
                <div className="h-px w-8 bg-amber-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Why Choose Us</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Academic Excellence</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium opacity-80">We provide a unique blend of traditional values and modern education to prepare students for the future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Scientific Rigor', icon: BookOpen, color: 'blue', desc: 'Our curriculum focuses on deep conceptual understanding and practical application of scientific principles.' },
              { title: 'Character Building', icon: Star, color: 'amber', desc: 'We believe in nurturing not just smart minds, but compassionate hearts and strong moral character.' },
              { title: 'Safe & Secure', icon: ShieldCheck, color: 'emerald', desc: 'A secure campus with 24/7 monitoring and a supportive environment for every student to thrive.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -15 }}
                className="group p-12 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)]"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-${feature.color}-500/10`}>
                  <feature.icon className={`h-10 w-10 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium opacity-80">{feature.desc}</p>
                
                <div className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800">
                  <Link to="/about" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-amber-500 transition-colors">
                    <span>Read More</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Toppers Section */}
      {settings.result_section_enabled && results.length > 0 && (
        <section className="py-40 bg-slate-950 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Hall of Fame</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 tracking-tight">Academic <span className="text-amber-500">Stars</span></h2>
                <p className="text-slate-400 text-xl font-medium opacity-80">Celebrating the extraordinary achievements of our top performing students who have set new benchmarks of excellence.</p>
              </div>
              <Link to="/results" className="group flex items-center space-x-4 bg-white/5 hover:bg-amber-500 hover:text-slate-950 px-8 py-4 rounded-2xl border border-white/10 transition-all">
                <span className="font-black uppercase tracking-widest text-xs">View All Results</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {results.slice(0, 4).map((res, idx) => (
                <motion.div 
                  key={res.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group relative rounded-[3rem] overflow-hidden aspect-[3/4] bg-slate-900 border border-white/5 shadow-2xl"
                >
                  <img src={res.photo_url || 'https://picsum.photos/seed/student/400/400'} alt={res.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-6 right-6">
                    <div className="bg-amber-500 text-slate-950 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                      #{idx + 1}
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="text-amber-500 font-serif font-bold text-5xl mb-4 tracking-tighter group-hover:scale-110 transition-transform origin-left">{res.marks}%</div>
                    <h4 className="text-2xl font-serif font-bold mb-2 tracking-tight">{res.name}</h4>
                    <div className="flex items-center space-x-3 text-slate-400">
                      <div className="h-px w-4 bg-slate-700" />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Roll: {res.roll_no}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-40 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-1">
              <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full mb-8">
                <Users className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Testimonials</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-10 leading-[1.1] tracking-tight">Voices of Our Community</h2>
              <p className="text-xl text-slate-500 mb-12 font-medium opacity-80">Real stories from students and parents who have experienced the Unique Science Academy difference.</p>
              
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 shadow-lg" alt="Avatar" />
                  ))}
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">2,000+</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Happy Families</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
              {settings.testimonials.map((t: any, idx: number) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-all duration-500"
                >
                  <Quote className="h-12 w-12 text-amber-500/10 mb-8 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-600 dark:text-slate-400 italic mb-10 text-lg leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center space-x-5">
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                    <div>
                      <h5 className="font-serif font-bold text-xl text-slate-900 dark:text-white">{t.name}</h5>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-[0.2em]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-40 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 md:p-24">
                <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-10">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Contact Us</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-12 tracking-tight">Let's <span className="text-amber-500 text-italic">Connect</span></h2>
                
                <div className="space-y-12">
                  {[
                    { title: 'Visit Our Campus', desc: settings.contact_address, icon: MapPin },
                    { title: 'Give Us a Call', desc: settings.contact_phone, icon: Phone },
                    { title: 'Send an Email', desc: settings.contact_email, icon: Mail },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-8 group"
                    >
                      <div className="bg-white/5 p-5 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-500">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <div>
                        <h5 className="text-white font-serif font-bold mb-2 text-xl tracking-tight">{item.title}</h5>
                        <p className="text-slate-400 font-medium opacity-80 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative h-full min-h-[500px] lg:min-h-full overflow-hidden">
                <img src="https://picsum.photos/seed/map/1200/1200" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] text-center max-w-sm shadow-2xl"
                  >
                    <div className="bg-amber-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/20">
                      <Clock className="h-10 w-10 text-slate-950" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold text-white mb-4 tracking-tight">Office Hours</h4>
                    <div className="space-y-2">
                      <p className="text-slate-300 font-medium">Monday — Saturday</p>
                      <p className="text-amber-500 font-black text-xl">8:00 AM — 4:00 PM</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sunday: Closed</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
