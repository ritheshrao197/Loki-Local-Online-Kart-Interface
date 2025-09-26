import type { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About Loki',
  description: 'Learn about our mission to connect local manufacturers and artisans with buyers, empowering small businesses and celebrating craftsmanship.',
};

// Add revalidation for ISR
export const revalidate = 86400; // Revalidate once per day

export default function AboutUsPage() {
  return <AboutClient />;
}