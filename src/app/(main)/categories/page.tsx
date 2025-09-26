import { Metadata } from 'next';
import { CategoriesPageClient } from './CategoriesPageClient';

export const metadata: Metadata = {
  title: 'Categories - Loki Local Kart',
  description: 'Browse products by category. Find exactly what you need from our organized collection of tech essentials, bags, work essentials, and more.',
  keywords: 'categories, tech essentials, bags, wallets, work essentials, audio, wearables, photography, gaming',
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}