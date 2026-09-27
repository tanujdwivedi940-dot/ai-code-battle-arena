"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Trophy, User, Layers } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const { address } = useAccount();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Arena', icon: Swords },
    { href: '/skills', label: 'Skills & Topics', icon: Layers },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="border-b border-[#2A2F38] bg-[#0B0D10] sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo with subtle icon scale on hover */}
          <Link href="/" className="flex items-center space-x-3 group transition-opacity duration-150 hover:opacity-95">
            <div className="w-8 h-8 rounded-lg bg-[#171A21] border border-[#2A2F38] flex items-center justify-center group-hover:border-[#3B82F6] transition-all duration-200 ease-out group-hover:-translate-y-[1px]">
              <Swords className="h-4 w-4 text-[#3B82F6] transition-transform duration-200 ease-out group-hover:scale-105" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm tracking-tight text-[#F1F5F9] transition-colors duration-150 group-hover:text-white">
                AI Code Battle
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono tracking-wider -mt-0.5">
                Polygon Amoy
              </span>
            </div>
          </Link>

          {/* Navigation Links with smooth pill transitions */}
          <div className="hidden md:flex items-center space-x-1 bg-[#0F1115] p-1 rounded-lg border border-[#2A2F38]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ease-out active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#171A21] text-[#3B82F6] border border-[#2A2F38] font-semibold shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#171A21]/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 transition-transform duration-150" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Profile Link */}
            <Link 
              href={address ? `/profile/${address}` : '/profile'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ease-out active:scale-[0.98] ${
                pathname.startsWith('/profile')
                  ? 'bg-[#171A21] text-[#3B82F6] border border-[#2A2F38] font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#171A21]/60'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Connect Button */}
          <div className="flex items-center transition-transform duration-150 active:scale-[0.98]">
            <ConnectButton 
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
          </div>

        </div>
      </div>
    </nav>
  );
}