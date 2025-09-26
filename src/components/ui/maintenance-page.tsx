'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Wrench, Clock, Mail, RefreshCw } from 'lucide-react';

interface MaintenancePageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  estimatedTime?: string;
  showNewsletter?: boolean;
  className?: string;
  backgroundImage?: string;
  onRefresh?: () => void;
}

export function MaintenancePage({
  title = "Under Maintenance",
  subtitle = "We're working to improve your experience",
  description = "Our website is currently undergoing scheduled maintenance. We'll be back online shortly.",
  estimatedTime,
  showNewsletter = true,
  className = '',
  backgroundImage,
  onRefresh
}: MaintenancePageProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll be notified when we're back online.",
      });
      
      setEmail('');
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setLastChecked(new Date());
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center relative overflow-hidden", className)}>
      {/* Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up" distance={30} delay={0.2}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Wrench className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.6}>
          <h2 className="text-xl md:text-2xl text-white/80 mb-4">
            {subtitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.8}>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        </ScrollReveal>

        {/* Estimated Time */}
        {estimatedTime && (
          <ScrollReveal direction="up" distance={30} delay={1.0}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-white/70" />
                <span className="text-white/70 text-sm">Estimated completion</span>
              </div>
              <div className="text-white font-semibold">
                {estimatedTime}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Refresh Button */}
        <ScrollReveal direction="up" distance={30} delay={1.2}>
          <div className="mb-8">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            <p className="text-white/60 text-sm mt-2">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          </div>
        </ScrollReveal>

        {/* Newsletter Signup */}
        {showNewsletter && (
          <ScrollReveal direction="up" distance={30} delay={1.4}>
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-white font-semibold mb-4">
                Get notified when we're back
              </h3>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isSubscribed}
                />
                <Button 
                  type="submit"
                  disabled={isSubscribed || !email}
                  className="px-6"
                >
                  {isSubscribed ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-sm text-white/60 mt-2">
                We'll email you when maintenance is complete
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Contact Info */}
        <ScrollReveal direction="up" distance={30} delay={1.6}>
          <div className="text-center">
            <p className="text-white/60 mb-4">Need immediate assistance?</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10"
                asChild
              >
                <a href="mailto:support@example.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface MaintenanceBannerProps {
  message?: string;
  estimatedTime?: string;
  className?: string;
  onDismiss?: () => void;
}

export function MaintenanceBanner({
  message = "Scheduled maintenance in progress. Some features may be temporarily unavailable.",
  estimatedTime,
  className = '',
  onDismiss
}: MaintenanceBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={cn("bg-yellow-500 text-white p-4 text-center relative", className)}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
        <Wrench className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {estimatedTime && (
            <p className="text-sm opacity-90 mt-1">
              Estimated completion: {estimatedTime}
            </p>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20"
          >
            ×
          </Button>
        )}
      </div>
    </motion.div>
  );
}
