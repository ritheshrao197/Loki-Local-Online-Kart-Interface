'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
       <motion.section 
         className="text-center"
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
                Contact Us
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
                Have questions or feedback? We'd love to hear from you.
            </motion.p>
        </motion.section>

        <motion.section 
          className="mt-16 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
                <motion.div 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  whileHover={{ 
                    x: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                        <Mail className="h-6 w-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-semibold">Email Us</h3>
                        <p className="text-muted-foreground">For general inquiries, support, or feedback.</p>
                        <a href="mailto:support@loki.com" className="text-primary font-medium hover:underline">
                            support@loki.com
                        </a>
                    </div>
                </motion.div>
                 <motion.div 
                   className="flex items-start gap-4"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 1.2 }}
                   whileHover={{ 
                     x: 10,
                     transition: { duration: 0.3 }
                   }}
                 >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: -5,
                        transition: { duration: 0.3 }
                      }}
                    >
                        <Phone className="h-6 w-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-semibold">Call Us</h3>
                        <p className="text-muted-foreground">Our support team is available from 9 AM to 6 PM IST.</p>
                        <a href="tel:+911234567890" className="text-primary font-medium hover:underline">
                            +91 123 456 7890
                        </a>
                    </div>
                </motion.div>
                 <motion.div 
                   className="flex items-start gap-4"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 1.4 }}
                   whileHover={{ 
                     x: 10,
                     transition: { duration: 0.3 }
                   }}
                 >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                        <MapPin className="h-6 w-6" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-semibold">Our Office</h3>
                        <p className="text-muted-foreground">123 Commerce House, Tech Park, Bengaluru, 560100</p>
                    </div>
                </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
                 <Card>
                    <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div 
                              className="space-y-2"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 1.2 }}
                            >
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" required />
                            </motion.div>
                             <motion.div 
                               className="space-y-2"
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ duration: 0.5, delay: 1.3 }}
                             >
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required />
                            </motion.div>
                             <motion.div 
                               className="space-y-2"
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ duration: 0.5, delay: 1.4 }}
                             >
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." required />
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 1.5 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button type="submit" className="w-full">Send Message</Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.section>
    </div>
  );
}