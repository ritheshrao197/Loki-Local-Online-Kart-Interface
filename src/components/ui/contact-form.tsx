'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export function ContactForm({ 
  title = "Get in Touch", 
  subtitle = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  className = '',
  onSubmit
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default form submission
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      }
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <div className="text-center mb-8">
        <ScrollReveal direction="up" distance={30}>
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </ScrollReveal>
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <p className="text-muted-foreground">{subtitle}</p>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" distance={30} delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={cn(errors.name && "border-destructive")}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={cn(errors.email && "border-destructive")}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  {...register('subject')}
                  className={cn(errors.subject && "border-destructive")}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  className={cn(errors.message && "border-destructive")}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}

interface ContactInfoProps {
  title?: string;
  items: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
  }[];
  className?: string;
}

export function ContactInfo({ 
  title = "Contact Information", 
  items, 
  className = '' 
}: ContactInfoProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <ScrollReveal direction="up" distance={30}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
      </ScrollReveal>

      <div className="space-y-4">
        {items.map((item, index) => (
          <ScrollReveal key={index} direction="up" distance={30} delay={index * 0.1}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                {item.href ? (
                  <a 
                    href={item.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{item.value}</p>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
