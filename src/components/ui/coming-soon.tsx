'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Mail, Clock, Bell } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  description?: string;
  launchDate?: Date;
  showCountdown?: boolean;
  showNewsletter?: boolean;
  className?: string;
  backgroundImage?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  subtitle = "Something amazing is on the way",
  description = "We're working hard to bring you something incredible. Stay tuned for updates!",
  launchDate,
  showCountdown = true,
  showNewsletter = true,
  className = '',
  backgroundImage
}: ComingSoonProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!launchDate || !showCountdown) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate, showCountdown]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll be notified when we launch.",
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
            <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.6}>
          <h2 className="text-xl md:text-2xl text-white/80 mb-4">
            {subtitle}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.8}>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        </ScrollReveal>

        {/* Countdown */}
        {showCountdown && launchDate && (
          <ScrollReveal direction="up" distance={30} delay={1.0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div
                  key={unit}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/70 capitalize">
                    {unit}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Newsletter Signup */}
        {showNewsletter && (
          <ScrollReveal direction="up" distance={30} delay={1.2}>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  disabled={isSubscribed}
                />
                <Button 
                  type="submit"
                  disabled={isSubscribed || !email}
                  className="px-6"
                >
                  {isSubscribed ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-sm text-white/60 mt-2">
                Get notified when we launch
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Social Links */}
        <ScrollReveal direction="up" distance={30} delay={1.4}>
          <div className="flex justify-center gap-4 mt-12">
            {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social, index) => (
              <motion.a
                key={social}
                href="#"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                <span className="text-xs font-medium">{social[0]}</span>
              </motion.a>
            ))}
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
