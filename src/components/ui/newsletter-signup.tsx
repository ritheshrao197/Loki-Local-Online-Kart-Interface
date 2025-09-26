'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Mail, Check } from 'lucide-react';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  onSubmit?: (data: NewsletterFormData) => Promise<void>;
  variant?: 'default' | 'inline' | 'card';
}

export function NewsletterSignup({ 
  title = "Stay Updated",
  subtitle = "Get the latest news and updates delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = '',
  onSubmit,
  variant = 'default'
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const handleFormSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default form submission
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      }
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest updates soon.",
      });
      
      reset();
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={cn("w-full max-w-md", className)}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2">
          <Input
            {...register('email')}
            type="email"
            placeholder={placeholder}
            className={cn(errors.email && "border-destructive")}
            disabled={isSubmitting || isSubscribed}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || isSubscribed}
            className="px-6"
          >
            {isSubscribed ? (
              <Check className="w-4 h-4" />
            ) : isSubmitting ? (
              "Subscribing..."
            ) : (
              buttonText
            )}
          </Button>
        </form>
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <ScrollReveal direction="up" distance={30}>
        <div className={cn("bg-card rounded-lg p-6 border shadow-sm", className)}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              placeholder={placeholder}
              className={cn(errors.email && "border-destructive")}
              disabled={isSubmitting || isSubscribed}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribed!
                </>
              ) : isSubmitting ? (
                "Subscribing..."
              ) : (
                buttonText
              )}
            </Button>
          </form>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal direction="up" distance={30}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        </ScrollReveal>
        
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              {...register('email')}
              type="email"
              placeholder={placeholder}
              className={cn(errors.email && "border-destructive")}
              disabled={isSubmitting || isSubscribed}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || isSubscribed}
              className="px-8"
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribed!
                </>
              ) : isSubmitting ? (
                "Subscribing..."
              ) : (
                buttonText
              )}
            </Button>
          </form>
          {errors.email && (
            <p className="text-sm text-destructive mt-2">{errors.email.message}</p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
