"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Handshake } from 'lucide-react';
import type { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'About Loki',
  description: 'Learn about our mission to connect local manufacturers and artisans with buyers, empowering small businesses and celebrating craftsmanship.',
};

// Add revalidation for ISR
export const revalidate = 86400; // Revalidate once per day

export default function AboutUsPage() {
  return (
    <div className="py-12">
      <motion.section 
        className="text-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold font-headline tracking-tight lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          About Loki
        </motion.h1>
        <motion.p 
          className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Connecting local manufacturers and artisans with buyers, empowering small businesses and celebrating craftsmanship.
        </motion.p>
      </motion.section>

      <motion.section 
        className="py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="relative aspect-[16/6] w-full">
            <Image
            src="https://picsum.photos/seed/about-banner/1600/600"
            alt="Artisans working"
            fill
            className="object-cover"
            data-ai-hint="artisans community"
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZGRkIi8+PC9zdmc+"
            />
        </div>
      </motion.section>
      
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
                <motion.div
                  className="mx-auto h-12 w-12 text-primary mb-4"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Target className="mx-auto h-12 w-12 text-primary mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold font-headline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.1 }}
                >
                  Our Mission
                </motion.h3>
                <motion.p 
                  className="mt-2 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                To provide a platform where local creators can thrive by connecting them directly with a market that values authenticity and quality.
                </motion.p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
                <motion.div
                  className="mx-auto h-12 w-12 text-primary mb-4"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold font-headline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.4 }}
                >
                  Our Community
                </motion.h3>
                <motion.p 
                  className="mt-2 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.5 }}
                >
                We are a community of sellers, buyers, and creators passionate about supporting local economies and preserving traditional crafts.
                </motion.p>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
                <motion.div
                  className="mx-auto h-12 w-12 text-primary mb-4"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold font-headline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.7 }}
                >
                  Our Values
                </motion.h3>
                <motion.p 
                  className="mt-2 text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.8 }}
                >
                We believe in transparency, quality, and sustainability. We are committed to ethical practices that benefit both our sellers and customers.
                </motion.p>
            </motion.div>
        </div>
      </motion.section>
    </div>
  );
}