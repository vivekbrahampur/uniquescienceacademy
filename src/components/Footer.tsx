import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Microscope, ArrowRight, School } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { QRCodeSVG } from 'qrcode.react';

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
    { label: 'About', to: '/about' },
    { label: 'Results', to: '/results' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <footer className="bg-slate-900 text-white py-24 relative overflow-hidden print:hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
              <div className="bg-white p-2 rounded-xl group-hover:bg-amber-500 transition-colors">
                <School className="h-6 w-6 text-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold leading-none">
                  {themeSettings?.schoolName?.split(' ')[0] || 'Unique'}
                </span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                  Academy
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Empowering students with knowledge, character, and the skills to lead in an ever-changing world. Join us in our journey of excellence.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/5 p-3 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-white/10 transition-all">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  {contact.address}
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-slate-400 text-sm">
                  {contact.phone}
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="text-slate-400 text-sm">
                  {contact.email}
                </span>
              </li>
            </ul>
          </div>

          {/* QR Code Column */}
          <div className="flex flex-col items-center lg:items-end">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-8">Mobile App</h4>
            <div className="p-3 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG 
                value={contact.qr_content || window.location.origin}
                size={100}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center lg:text-right">
              Scan to visit <br /> our website
            </p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {themeSettings?.schoolName || 'Unique Academy'}. All rights reserved.
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-xs text-slate-500 hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-amber-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
