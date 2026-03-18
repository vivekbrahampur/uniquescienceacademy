import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { QRCodeSVG } from 'qrcode.react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { settings: themeSettings } = useTheme();
  const [contact, setContact] = useState({
    address: 'Brahampur, Jale\nDarbhanga, Bihar 847307',
    email: 'info@uniquescienceacademy.in',
    phone: '+91 98765 43210',
    qr_content: 'https://uniquescienceacademy.onrender.com'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setContact({
            address: data.contact_address || contact.address,
            email: data.contact_email || contact.email,
            phone: data.contact_phone || contact.phone,
            qr_content: data.home_page_qr_content || contact.qr_content
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Student Portal', to: '/student/login' },
    { label: 'Teacher Portal', to: '/teacher/login' },
    { label: 'Admin Login', to: '/admin/login' },
    { label: 'Exam Results', to: '/#results' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 py-20 print:hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Mail className="h-6 w-6 text-slate-900" />
              </div>
              <h3 className="text-white text-xl font-serif font-bold tracking-tight">
                {themeSettings.schoolName || 'Unique Science Academy'}
              </h3>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Empowering minds through science and innovation. We provide a nurturing environment for students to excel academically and personally.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center text-sm hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                <address className="not-italic text-sm leading-relaxed">
                  {contact.address.split('\n').map((line, idx) => (
                    <span key={idx} className="block">{line}</span>
                  ))}
                </address>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-sm">{contact.email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter/QR Column */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Visit Us</h4>
            <div className="bg-slate-900 p-6 rounded-2xl flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-xl mb-4 shadow-xl">
                {contact.qr_content && <QRCodeSVG value={contact.qr_content} size={120} />}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Scan to visit website</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            © {new Date().getFullYear()} {themeSettings.schoolName}. All rights reserved.
          </p>
          <div className="flex space-x-8 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
