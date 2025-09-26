
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

// This page uses 'use client', so we cannot export metadata directly.
// We can set it in the parent layout or use a different approach if needed.
/*
export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Loki team. We are here to help with any questions or feedback you may have.',
};
*/

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        // Here you would typically handle form submission
        const form = e.target as HTMLFormElement;
        form.reset();
    };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
       <section className="text-center">
            <h1 className="text-4xl font-bold font-headline tracking-tight lg:text-5xl">
                Contact Us
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
            </p>
        </section>

        <section className="mt-16 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Email Us</h3>
                        <p className="text-muted-foreground">For general inquiries, support, or feedback.</p>
                        <a href="mailto:support@loki.com" className="text-primary font-medium hover:underline">
                            support@loki.com
                        </a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Call Us</h3>
                        <p className="text-muted-foreground">Our support team is available from 9 AM to 6 PM IST.</p>
                        <a href="tel:+911234567890" className="text-primary font-medium hover:underline">
                            +91 123 456 7890
                        </a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Our Office</h3>
                        <p className="text-muted-foreground">123 Commerce House, Tech Park, Bengaluru, 560100</p>
                    </div>
                </div>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." required />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}
