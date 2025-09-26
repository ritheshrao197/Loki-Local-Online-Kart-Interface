'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Enhanced 3D Graphics & Animations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Showcasing improved visual design with depth, motion, and interactive elements
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {/* 3D Card Demo */}
        <div>
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                3D Card Effect
              </CardTitle>
              <CardDescription>
                Enhanced depth with layered shadows and hover effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transform rotate-3">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Cards with enhanced 3D appearance using layered gradients and shadows
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Animated Button Demo */}
        <div>
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Animated Buttons
              </CardTitle>
              <CardDescription>
                Interactive elements with micro-animations
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button className="w-full">
                Primary Button
              </Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Buttons with lift effect, shadow transitions, and smooth hover animations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motion Graphics Demo */}
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Motion Graphics
              </CardTitle>
              <CardDescription>
                Animated workflow visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Motion graphics demo would appear here with framer-motion animations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}