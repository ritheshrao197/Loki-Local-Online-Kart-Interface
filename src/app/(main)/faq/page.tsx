import type { Metadata } from 'next';
import { FAQClient } from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Find answers to common questions about buying and selling on Loki, covering orders, payments, shipping, and seller accounts.',
};

export default function FAQPage() {
  return <FAQClient />;
}