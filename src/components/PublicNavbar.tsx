// components/PublicNavbar.tsx
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Program Kami', href: '/programs' },
    { name: 'Tentang TJSL', href: '/about' },
    { name: 'Kontak', href: '/contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#1E40AF] to-[#1E3A8A] shadow-xl border-b border-[#FCD34D]/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-xl p-1.5 group-hover:bg-white/20 transition-all duration-300">
                <Image
                  src="/PLN.png"
                  alt="PLN Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg lg:text-xl leading-tight group-hover:text-[#FCD34D] transition-colors duration-300">
                  SIM CSR
                </span>
                <span className="text-[#FCD34D] text-xs lg:text-sm font-semibold">
                  PLN UIP Kota Makassar
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-[#FCD34D] transition-all duration-300 font-semibold text-sm xl:text-base relative group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FCD34D] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              asChild
              className="bg-[#FCD34D] hover:bg-[#F59E0B] text-[#1E40AF] font-bold px-6 py-2.5 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl"
            >
              <Link href="/login">Masuk</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-[#FCD34D] transition-colors duration-300 p-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="flex flex-col space-y-2 pt-4 border-t border-[#FCD34D]/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FCD34D] transition-all duration-300 font-semibold py-3 px-4 rounded-xl hover:bg-white/10 border border-transparent hover:border-[#FCD34D]/30"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#FCD34D]/20 mt-4">
              <Button
                asChild
                className="w-full bg-[#FCD34D] hover:bg-[#F59E0B] text-[#1E40AF] font-bold py-3 transition-all duration-300 hover:shadow-lg rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/login">Masuk</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}