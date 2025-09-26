'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FloatingCard } from '@/components/ui/floating-elements';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks?: {
    platform: string;
    url: string;
    icon: LucideIcon;
  }[];
}

interface TeamGridProps {
  members: TeamMember[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function TeamGrid({ 
  members, 
  title, 
  subtitle, 
  className = '',
  columns = 3
}: TeamGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <section className={cn("py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <ScrollReveal direction="up" distance={30}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {title}
                </h2>
              </ScrollReveal>
            )}
            {subtitle && (
              <ScrollReveal direction="up" distance={30} delay={0.2}>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </ScrollReveal>
            )}
          </div>
        )}

        <div className={cn("grid grid-cols-1 gap-8", gridCols[columns])}>
          {members.map((member, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              distance={30} 
              delay={index * 0.1}
            >
              <FloatingCard delay={index * 0.1}>
                <div className="text-center p-6">
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20"
                    />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="flex justify-center gap-3">
                      {member.socialLinks.map((link, linkIndex) => (
                        <motion.a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <link.icon className="w-4 h-4 text-primary" />
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </FloatingCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
  delay?: number;
}

export function TeamMemberCard({ 
  member, 
  className = '',
  delay = 0
}: TeamMemberCardProps) {
  return (
    <ScrollReveal direction="up" distance={30} delay={delay}>
      <FloatingCard delay={delay}>
        <div className={cn("text-center p-6", className)}>
          <motion.div
            className="relative mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/20"
            />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
          <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-3">
            {member.bio}
          </p>
          
          {member.socialLinks && member.socialLinks.length > 0 && (
            <div className="flex justify-center gap-2">
              {member.socialLinks.map((link, linkIndex) => (
                <motion.a
                  key={linkIndex}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-3 h-3 text-primary" />
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </FloatingCard>
    </ScrollReveal>
  );
}
