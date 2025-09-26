"use client"

import { GraphicsDemo } from '@/components/graphics-demo'

export default function GraphicsDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline">Enhanced Graphics & Animations</h1>
          <p className="text-muted-foreground mt-2">
            Showcasing improved 3D visuals, animations, and motion graphics
          </p>
        </div>
        <div className="py-8">
          <GraphicsDemo />
        </div>
      </div>
    </div>
  )
}