
'use client';
import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/logo';

export const Footer = React.memo(function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting local manufacturers with buyers across India.
            </p>
          </div>
          <div className="md:col-start-2">
            <h3 className="font-semibold font-headline mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/login/admin" className="text-sm hover:text-primary transition-colors">Sell on Loki</Link></li>
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold font-headline mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold font-headline mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Facebook</Link></li>
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link href="/" className="text-sm hover:text-primary transition-colors">Twitter</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Loki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
});
