
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Handshake } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Loki',
  description: 'Learn about our mission to connect local manufacturers and artisans with buyers, empowering small businesses and celebrating craftsmanship.',
};

export default function AboutUsPage() {
  return (
    <div className="py-12">
      <section className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
          About Loki
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Connecting local manufacturers and artisans with buyers, empowering small businesses and celebrating craftsmanship.
        </p>
      </section>

      <section className="py-16">
        <div className="relative aspect-[16/6] w-full">
            <Image
            src="https://picsum.photos/seed/about-banner/1600/600"
            alt="Artisans working"
            fill
            className="object-cover"
            data-ai-hint="artisans community"
            />
        </div>
      </section>
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
                <Target className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold font-headline">Our Mission</h3>
                <p className="mt-2 text-muted-foreground">
                To provide a platform where local creators can thrive by connecting them directly with a market that values authenticity and quality.
                </p>
            </div>
            <div className="p-6">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold font-headline">Our Community</h3>
                <p className="mt-2 text-muted-foreground">
                We are a community of sellers, buyers, and creators passionate about supporting local economies and preserving traditional crafts.
                </p>
            </div>
            <div className="p-6">
                <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold font-headline">Our Values</h3>
                <p className="mt-2 text-muted-foreground">
                We believe in transparency, quality, and sustainability. We are committed to ethical practices that benefit both our sellers and customers.
                </p>
            </div>
        </div>
      </section>
    </div>
  );
}
