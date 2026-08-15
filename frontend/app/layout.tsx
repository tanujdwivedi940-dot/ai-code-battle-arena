import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Web3Provider from '@/components/Web3Provider';

export const metadata: Metadata = {
  title: 'AI Code Battle Arena | 1v1 On-Chain Coding Battles',
  description: '1v1 Live developer battles judged by Google Gemini AI with instant testnet crypto payouts and Soulbound NFT reputation badges on Polygon Amoy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-arena-bg text-gray-100 antialiased selection:bg-arena-neonCyan selection:text-black">
        <Web3Provider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-arena-border/50 py-6 text-center text-xs text-gray-500 font-mono">
            AI Code Battle Arena © 2025 • Powered by Google Gemini & Polygon Amoy Testnet
          </footer>
        </Web3Provider>
      </body>
    </html>
  );
}